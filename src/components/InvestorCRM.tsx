'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, Download, Share2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export interface Investor {
  id: string;
  name: string;
  firm?: string;
  email: string;
  stage: 'researching' | 'contacted' | 'meeting' | 'due_diligence' | 'term_sheet' | 'closed' | 'passed';
  investment_range?: string;
  focus_areas?: string[];
  last_contact?: string;
  notes?: string;
  data_room_access?: boolean;
}

const STAGES: Investor['stage'][] = [
  'researching', 'contacted', 'meeting', 'due_diligence', 'term_sheet', 'closed', 'passed'
];

const STAGE_COLORS: Record<Investor['stage'], string> = {
  researching: 'bg-slate-500',
  contacted: 'bg-blue-500',
  meeting: 'bg-cyan-500',
  due_diligence: 'bg-yellow-500',
  term_sheet: 'bg-purple-500',
  closed: 'bg-green-500',
  passed: 'bg-red-500',
};

export function InvestorCRM() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<Investor['stage'] | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newInvestor, setNewInvestor] = useState<Partial<Investor>>({
    stage: 'researching',
  });

  // Load investors from localStorage (demo mode) or API
  useEffect(() => {
    const saved = localStorage.getItem('gangniaga_investors');
    if (saved) {
      setInvestors(JSON.parse(saved));
    } else {
      // Demo data
      const demo: Investor[] = [
        {
          id: '1',
          name: 'Ahmad Rahman',
          firm: 'MY Ventures',
          email: 'ahmad@myventures.my',
          stage: 'meeting',
          investment_range: 'RM500K-2M',
          focus_areas: ['fintech', 'e-commerce'],
          last_contact: '2024-01-15',
          notes: 'Interested in our Shopee integration',
          data_room_access: true,
        },
        {
          id: '2',
          name: 'Sarah Lim',
          firm: 'ASEAN Growth Fund',
          email: 'sarah@aseangrowth.vc',
          stage: 'due_diligence',
          investment_range: 'RM1M-5M',
          focus_areas: ['saas', 'ai', 'creator-economy'],
          last_contact: '2024-01-20',
          notes: 'Requested financial projections',
          data_room_access: true,
        },
      ];
      setInvestors(demo);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('gangniaga_investors', JSON.stringify(investors));
  }, [investors]);

  const filteredInvestors = investors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.firm?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'all' || inv.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const handleAddInvestor = () => {
    if (!newInvestor.name || !newInvestor.email) {
      toast.error('Name and email are required');
      return;
    }

    const investor: Investor = {
      id: `inv-${Date.now()}`,
      name: newInvestor.name!,
      firm: newInvestor.firm,
      email: newInvestor.email!,
      stage: newInvestor.stage || 'researching',
      investment_range: newInvestor.investment_range,
      focus_areas: newInvestor.focus_areas,
      last_contact: new Date().toISOString().split('T')[0],
      notes: newInvestor.notes,
      data_room_access: false,
    };

    setInvestors(prev => [...prev, investor]);
    setNewInvestor({ stage: 'researching' });
    setIsAddDialogOpen(false);
    toast.success('Investor added');
  };

  const handleStageChange = (id: string, stage: Investor['stage']) => {
    setInvestors(prev => prev.map(inv => 
      inv.id === id ? { ...inv, stage, last_contact: new Date().toISOString().split('T')[0] } : inv
    ));
    toast.info(`Updated to ${stage.replace('_', ' ')}`);
  };

  const toggleDataRoom = (id: string) => {
    setInvestors(prev => prev.map(inv => 
      inv.id === id ? { ...inv, data_room_access: !inv.data_room_access } : inv
    ));
    toast.success('Data room access updated');
  };

  const exportInvestors = () => {
    const csv = [
      ['Name', 'Firm', 'Email', 'Stage', 'Investment Range', 'Last Contact'].join(','),
      ...filteredInvestors.map(inv => [
        inv.name, inv.firm || '', inv.email, inv.stage, inv.investment_range || '', inv.last_contact || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Exported to CSV');
  };

  const getRunwayAlert = () => {
    // Demo: calculate based on investor stages
    const active = investors.filter(i => ['meeting', 'due_diligence', 'term_sheet'].includes(i.stage)).length;
    if (active === 0) return { level: 'warning', message: 'No active investor conversations' };
    if (active >= 3) return { level: 'success', message: `${active} investors in pipeline - strong momentum!` };
    return { level: 'info', message: `${active} investor(s) in active discussions` };
  };

  const alert = getRunwayAlert();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Investor CRM</h2>
          <p className="text-muted-foreground">Track your fundraising pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportInvestors}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Investor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Investor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Investor Name *"
                  value={newInvestor.name || ''}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Firm / VC Name"
                  value={newInvestor.firm || ''}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, firm: e.target.value }))}
                />
                <Input
                  placeholder="Email *"
                  type="email"
                  value={newInvestor.email || ''}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  placeholder="Investment Range (e.g., RM500K-2M)"
                  value={newInvestor.investment_range || ''}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, investment_range: e.target.value }))}
                />
                <Select
                  value={newInvestor.stage}
                  onValueChange={(value: Investor['stage']) => setNewInvestor(prev => ({ ...prev, stage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {stage.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddInvestor} className="w-full">Add Investor</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Runway Alert */}
      <Card className={alert.level === 'warning' ? 'border-yellow-500' : alert.level === 'success' ? 'border-green-500' : ''}>
        <CardContent className="pt-6 flex items-center gap-2">
          <AlertCircle className={`w-4 h-4 ${alert.level === 'warning' ? 'text-yellow-500' : alert.level === 'success' ? 'text-green-500' : 'text-blue-500'}`} />
          <span className="text-sm">{alert.message}</span>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search investors..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStage} onValueChange={(v: any) => setFilterStage(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {STAGES.map(stage => (
              <SelectItem key={stage} value={stage}>{stage.replace('_', ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Investors Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Data Room</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No investors found. Add your first investor to start tracking!
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvestors.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{inv.name}</div>
                        <div className="text-sm text-muted-foreground">{inv.firm}</div>
                        <div className="text-xs text-muted-foreground">{inv.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={inv.stage}
                        onValueChange={(value: Investor['stage']) => handleStageChange(inv.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <Badge variant="secondary" className={STAGE_COLORS[inv.stage]}>
                            {inv.stage.replace('_', ' ')}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map(stage => (
                            <SelectItem key={stage} value={stage}>
                              {stage.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">{inv.investment_range || '-'}</TableCell>
                    <TableCell className="text-sm">{inv.last_contact || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant={inv.data_room_access ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleDataRoom(inv.id)}
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        {inv.data_room_access ? 'Access' : 'Grant'}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{investors.length}</div>
            <div className="text-sm text-muted-foreground">Total Investors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {investors.filter(i => ['meeting', 'due_diligence', 'term_sheet'].includes(i.stage)).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Pipeline</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {investors.filter(i => i.stage === 'closed').length}
            </div>
            <div className="text-sm text-muted-foreground">Closed Deals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {investors.filter(i => i.data_room_access).length}
            </div>
            <div className="text-sm text-muted-foreground">Data Room Access</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InvestorCRM;
