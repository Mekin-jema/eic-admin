'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, BarChart3, Eye, Mail, Users } from 'lucide-react';

interface CommunicationsStatsProps {
  stats: {
    totalSent: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribes: number;
  };
}

export default function CommunicationsStats({ stats }: CommunicationsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
              <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
              <p className="text-2xl font-bold">{stats.openRate}%</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
              <p className="text-2xl font-bold">{stats.clickRate}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
              <p className="text-2xl font-bold">{stats.bounceRate}%</p>
            </div>
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unsubscribes</p>
              <p className="text-2xl font-bold">{stats.unsubscribes}</p>
            </div>
            <Users className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
