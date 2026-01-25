// app/admin/analytics/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Filter, Globe, Building, TrendingUp, Target, 
 Users, 
  ArrowUpRight, ArrowDownRight, Activity, Cpu, Zap,
  Clock,  Tag, TrendingDown, Percent
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, 
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Progress } from '@/components/ui/progress';

// Mock data
const countryData = [
  { country: 'Ethiopia', attendees: 450, percentage: 36.1, growth: 12 },
  { country: 'USA', attendees: 156, percentage: 12.5, growth: 8 },
  { country: 'UK', attendees: 98, percentage: 7.9, growth: 15 },
  { country: 'China', attendees: 87, percentage: 7.0, growth: 22 },
  { country: 'India', attendees: 76, percentage: 6.1, growth: 18 },
  { country: 'Kenya', attendees: 65, percentage: 5.2, growth: 10 },
];

const interestData = [
  { sector: 'Technology', count: 320, color: '#0088FE' },
  { sector: 'Agriculture', count: 285, color: '#00C49F' },
  { sector: 'Energy', count: 198, color: '#FFBB28' },
  { sector: 'Finance', count: 176, color: '#FF8042' },
  { sector: 'Infrastructure', count: 154, color: '#8884D8' },
  { sector: 'Manufacturing', count: 132, color: '#82CA9D' },
];

const registrationTrendData = [
  { month: 'Jan', registrations: 120, checkins: 85 },
  { month: 'Feb', registrations: 145, checkins: 110 },
  { month: 'Mar', registrations: 178, checkins: 132 },
  { month: 'Apr', registrations: 210, checkins: 156 },
  { month: 'May', registrations: 245, checkins: 189 },
  { month: 'Jun', registrations: 289, checkins: 220 },
  { month: 'Jul', registrations: 320, checkins: 245 },
];

const typeData = [
  { type: 'VIP', count: 156, color: '#FF6B6B' },
  { type: 'Standard', count: 845, color: '#4ECDC4' },
  { type: 'Speaker', count: 42, color: '#FFD166' },
  { type: 'Exhibitor', count: 78, color: '#06D6A0' },
  { type: 'Media', count: 56, color: '#118AB2' },
];

const hourlyCheckinData = [
  { hour: '8 AM', count: 45 },
  { hour: '9 AM', count: 89 },
  { hour: '10 AM', count: 156 },
  { hour: '11 AM', count: 198 },
  { hour: '12 PM', count: 167 },
  { hour: '1 PM', count: 134 },
  { hour: '2 PM', count: 189 },
  { hour: '3 PM', count: 156 },
];

const radarData = [
  { metric: 'Check-in Rate', value: 85, fullMark: 100 },
  { metric: 'Satisfaction', value: 78, fullMark: 100 },
  { metric: 'Engagement', value: 92, fullMark: 100 },
  { metric: 'Diversity', value: 76, fullMark: 100 },
  { metric: 'Growth', value: 88, fullMark: 100 },
  { metric: 'Retention', value: 81, fullMark: 100 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Deep insights and data analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Demographics
          </TabsTrigger>
          <TabsTrigger value="sectors" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Sectors
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Predictive
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +24.5% from last year
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Int'l Diversity</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">Countries represented</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sector Coverage</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Major sectors covered</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Registration Trends</CardTitle>
                <CardDescription>Monthly registration and check-in growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={registrationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="registrations" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="checkins" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Event success indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Metrics"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Attendee distribution by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryData.map((item, index) => (
                    <div key={item.country} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="h-6 w-6 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{item.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.attendees}</span>
                          <span className="text-sm text-muted-foreground">({item.percentage}%)</span>
                          {item.growth > 10 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Types</CardTitle>
                <CardDescription>Distribution by attendee category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {typeData.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{item.count}</span>
                        <Badge variant="outline">
                          {Math.round((item.count / 1247) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Attendees by country and region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={countryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendees" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="growth" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demographic Insights</CardTitle>
                <CardDescription>Key demographic metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Continental Split</p>
                        <p className="text-sm text-muted-foreground">Africa leads at 65%</p>
                      </div>
                    </div>
                    <Badge>65%</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Corporate vs Individual</p>
                        <p className="text-sm text-muted-foreground">72% corporate</p>
                      </div>
                    </div>
                    <Badge variant="outline">72%</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Gender Diversity</p>
                        <p className="text-sm text-muted-foreground">42% female</p>
                      </div>
                    </div>
                    <Badge variant="secondary">42%</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">Age Distribution</p>
                        <p className="text-sm text-muted-foreground">Avg. age: 38</p>
                      </div>
                    </div>
                    <Badge variant="outline">38</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Regional Highlights</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">East Africa</span>
                      <Badge variant="outline">45%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">North America</span>
                      <Badge variant="outline">22%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Europe</span>
                      <Badge variant="outline">18%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Asia</span>
                      <Badge variant="outline">15%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sectors Tab */}
        <TabsContent value="sectors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sector Interest Analysis</CardTitle>
              <CardDescription>Investment interests across sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Sector Distribution</h4>
                  <div className="space-y-3">
                    {interestData.map((item) => (
                      <div key={item.sector} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium">{item.sector}</span>
                          </div>
                          <span className="font-medium">{item.count}</span>
                        </div>
                        <Progress 
                          value={(item.count / Math.max(...interestData.map(i => i.count))) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Sector Visualization</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={interestData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="sector" />
                      <Tooltip />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {interestData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sector Cross-Analysis</CardTitle>
              <CardDescription>Intersections and correlations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <h4 className="font-medium">Top Sector Combinations</h4>
                  <div className="space-y-3">
                    {[
                      { combo: 'Tech + Finance', count: 189 },
                      { combo: 'Energy + Infra', count: 156 },
                      { combo: 'Agri + Manufacturing', count: 132 },
                      { combo: 'Tech + Energy', count: 98 },
                      { combo: 'Finance + Infra', count: 76 },
                    ].map((item) => (
                      <div key={item.combo} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{item.combo}</span>
                        <Badge>{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Sector by Country</h4>
                  <div className="space-y-3">
                    {[
                      { country: 'Ethiopia', sector: 'Agriculture', percentage: 65 },
                      { country: 'USA', sector: 'Technology', percentage: 42 },
                      { country: 'China', sector: 'Manufacturing', percentage: 58 },
                      { country: 'UAE', sector: 'Finance', percentage: 47 },
                      { country: 'Germany', sector: 'Energy', percentage: 38 },
                    ].map((item) => (
                      <div key={item.country} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.country}</span>
                          <span className="text-sm text-muted-foreground">{item.sector}</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Growth Rates</h4>
                  <div className="space-y-3">
                    {[
                      { sector: 'Renewable Energy', growth: 45 },
                      { sector: 'FinTech', growth: 38 },
                      { sector: 'AgriTech', growth: 32 },
                      { sector: 'Logistics', growth: 28 },
                      { sector: 'Healthcare', growth: 24 },
                    ].map((item) => (
                      <div key={item.sector} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{item.sector}</span>
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                          <Badge variant="outline" className="text-green-600">
                            +{item.growth}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Hourly Check-in Pattern</CardTitle>
                <CardDescription>Real-time check-in trends throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={hourlyCheckinData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
                <CardDescription>Key insights from hourly data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">Peak Hour</p>
                        <p className="text-sm text-muted-foreground">11 AM - 198 check-ins</p>
                      </div>
                    </div>
                    <Badge variant="outline">Peak</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Avg. Rate</p>
                        <p className="text-sm text-muted-foreground">24.5 check-ins/hour</p>
                      </div>
                    </div>
                    <Badge variant="secondary">24.5/hr</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Morning Surge</p>
                        <p className="text-sm text-muted-foreground">+78% from 9-10 AM</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+78%</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Afternoon Dip</p>
                        <p className="text-sm text-muted-foreground">-24% from 1-2 PM</p>
                      </div>
                    </div>
                    <Badge variant="destructive">-24%</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                      <span>Increase staff during 10-11 AM peak</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <span>Schedule key sessions after 10 AM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5"></div>
                      <span>Offer incentives for early check-in</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registration Growth Forecast</CardTitle>
              <CardDescription>Predictive analysis for upcoming period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Growth Projection</h4>
                  <div className="space-y-4">
                    {[
                      { period: 'Next 7 days', expected: 89, growth: 12 },
                      { period: 'Next 30 days', expected: 356, growth: 18 },
                      { period: 'Next 90 days', expected: 987, growth: 24 },
                      { period: 'Full year', expected: 2456, growth: 32 },
                    ].map((item) => (
                      <div key={item.period} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.period}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{item.expected}</span>
                            <Badge className="bg-green-100 text-green-800">
                              +{item.growth}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={item.growth * 3} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Trend Indicators</h4>
                  <div className="space-y-4">
                    {[
                      { indicator: 'Social Media Buzz', trend: 'up', value: 78 },
                      { indicator: 'Website Traffic', trend: 'up', value: 92 },
                      { indicator: 'Email Engagement', trend: 'stable', value: 65 },
                      { indicator: 'Referral Rate', trend: 'up', value: 84 },
                      { indicator: 'Repeat Attendance', trend: 'up', value: 42 },
                    ].map((item) => (
                      <div key={item.indicator} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{item.indicator}</span>
                        <div className="flex items-center gap-2">
                          {item.trend === 'up' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 text-gray-400">-</div>
                          )}
                          <Badge variant="outline">{item.value}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Tab */}
        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Predictions</CardTitle>
              <CardDescription>Machine learning insights and forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Cpu className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Attendance Forecast</h4>
                        <p className="text-sm text-muted-foreground">95% confidence</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">1,892</div>
                      <p className="text-sm text-muted-foreground">Predicted final count</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Top Emerging Sector</h4>
                        <p className="text-sm text-muted-foreground">Based on trends</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">Green Energy</div>
                      <p className="text-sm text-muted-foreground">45% growth expected</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Peak Engagement</h4>
                        <p className="text-sm text-muted-foreground">Optimal timing</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">10:30 AM</div>
                      <p className="text-sm text-muted-foreground">Max audience reach</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Risk Indicators</h4>
                  <div className="space-y-3">
                    {[
                      { risk: 'No-show Probability', level: 'Low', value: 12 },
                      { risk: 'Check-in Bottleneck', level: 'Medium', value: 45 },
                      { risk: 'Overcrowding Risk', level: 'High', value: 78 },
                      { risk: 'Tech Failure Risk', level: 'Low', value: 18 },
                    ].map((item) => (
                      <div key={item.risk} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.risk}</span>
                          <Badge variant={
                            item.level === 'High' ? 'destructive' :
                            item.level === 'Medium' ? 'outline' : 'secondary'
                          }>
                            {item.level}
                          </Badge>
                        </div>
                        <Progress value={item.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Opportunity Areas</h4>
                  <div className="space-y-3">
                    {[
                      { opportunity: 'VIP Networking', potential: 'High', impact: 85 },
                      { opportunity: 'Sector Workshops', potential: 'Medium', impact: 65 },
                      { opportunity: 'Sponsor Engagement', potential: 'High', impact: 92 },
                      { opportunity: 'Post-Event Follow-up', potential: 'Medium', impact: 72 },
                    ].map((item) => (
                      <div key={item.opportunity} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.opportunity}</span>
                          <Badge className={
                            item.potential === 'High' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {item.potential}
                          </Badge>
                        </div>
                        <Progress value={item.impact} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}