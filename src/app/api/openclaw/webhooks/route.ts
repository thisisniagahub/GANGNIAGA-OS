import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

export async function GET() {
  try {
    const webhooks = await db.openClawWebhook.findMany({
      where: { organizationId: ORGANIZATION_ID },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = webhooks.map((wh) => ({
      ...wh,
      events: wh.events ? JSON.parse(wh.events) : [],
      headers: wh.headers ? JSON.parse(wh.headers) : null,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to fetch webhooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, method, events, secret, headers } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    const webhook = await db.openClawWebhook.create({
      data: {
        name,
        url,
        method: method || 'POST',
        events: events ? JSON.stringify(events) : null,
        status: 'active',
        secret: secret || null,
        headers: headers ? JSON.stringify(headers) : null,
        organizationId: ORGANIZATION_ID,
      },
    });

    return NextResponse.json(
      {
        ...webhook,
        events: webhook.events ? JSON.parse(webhook.events) : [],
        headers: webhook.headers ? JSON.parse(webhook.headers) : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create webhook:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, url, method, events, status, secret, headers } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook id is required' },
        { status: 400 }
      );
    }

    const existing = await db.openClawWebhook.findFirst({
      where: { id, organizationId: ORGANIZATION_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (method !== undefined) updateData.method = method;
    if (status !== undefined) updateData.status = status;
    if (secret !== undefined) updateData.secret = secret;
    if (events !== undefined) {
      updateData.events = JSON.stringify(events);
    }
    if (headers !== undefined) {
      updateData.headers = JSON.stringify(headers);
    }

    const webhook = await db.openClawWebhook.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...webhook,
      events: webhook.events ? JSON.parse(webhook.events) : [],
      headers: webhook.headers ? JSON.parse(webhook.headers) : null,
    });
  } catch (error) {
    console.error('Failed to update webhook:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook id is required as query parameter' },
        { status: 400 }
      );
    }

    const existing = await db.openClawWebhook.findFirst({
      where: { id, organizationId: ORGANIZATION_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      );
    }

    await db.openClawWebhook.delete({ where: { id } });

    return NextResponse.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    console.error('Failed to delete webhook:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}
