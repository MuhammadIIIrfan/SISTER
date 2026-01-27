import { BarChart3, LineChart, PieChart, TrendingUp, Users, MapPin, AlertCircle } from 'lucide-react';
import '../styles/analytics.css';

export default function Analytics() {
  const analyticsMetrics = [
    {
      title: 'Total Operasi',
      value: '2,547',
      change: '+12.5%',
      icon: TrendingUp,
      color: '#059669'
    },
    {
      title: 'Personel Aktif',
      value: '1,180',
      change: '+8.2%',
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Wilayah Operasi',
      value: '48',
      change: '+2.1%',
      icon: MapPin,
      color: '#059669'
    },
    {
      title: 'Incident Rate',
      value: '2.3%',
      change: '-5.1%',
      icon: AlertCircle,
      color: '#10b981'
    }
  ];

  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 82 },
    { label: 'Apr', value: 91 },
    { label: 'May', value: 85 },
    { label: 'Jun', value: 92 }
  ];

  const performanceData = [
    { category: 'Keamanan', percentage: 92 },
    { category: 'Operasional', percentage: 88 },
    { category: 'Personel', percentage: 85 },
    { category: 'Logistik', percentage: 90 }
  ];

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <h1 className="page-title">Analytics & Dashboard</h1>
        <p className="page-subtitle">Analisis data operasional dan kinerja Koramil 429-09</p>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {analyticsMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <div className="metric-icon" style={{ color: metric.color }}>
                  <IconComponent size={28} />
                </div>
                <span className={`metric-change ${metric.change.includes('+') ? 'positive' : 'negative'}`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="metric-title">{metric.title}</h3>
              <p className="metric-value">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Tren Operasional 6 Bulan Terakhir</h2>
            <span className="chart-type">Grafik Garis</span>
          </div>
          <div className="chart-wrapper">
            <div className="line-chart">
              <svg viewBox="0 0 600 300" className="chart-svg">
                {/* Grid lines */}
                <line x1="50" y1="250" x2="550" y2="250" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="200" x2="550" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="150" x2="550" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="100" x2="550" y2="100" stroke="#e5e7eb" strokeWidth="1" />

                {/* Line */}
                <polyline
                  points="50,195 133,140 216,125 299,55 382,90 465,45 550,90"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Dots */}
                <circle cx="50" cy="195" r="5" fill="#059669" />
                <circle cx="133" cy="140" r="5" fill="#059669" />
                <circle cx="216" cy="125" r="5" fill="#059669" />
                <circle cx="299" cy="55" r="5" fill="#059669" />
                <circle cx="382" cy="90" r="5" fill="#059669" />
                <circle cx="465" cy="45" r="5" fill="#059669" />
                <circle cx="550" cy="90" r="5" fill="#059669" />

                {/* X Axis */}
                <line x1="50" y1="250" x2="550" y2="250" stroke="#1f2937" strokeWidth="2" />
                <line x1="50" y1="250" x2="50" y2="270" stroke="#1f2937" strokeWidth="1" />
                <line x1="133" y1="250" x2="133" y2="270" stroke="#1f2937" strokeWidth="1" />
                <line x1="216" y1="250" x2="216" y2="270" stroke="#1f2937" strokeWidth="1" />
                <line x1="299" y1="250" x2="299" y2="270" stroke="#1f2937" strokeWidth="1" />
                <line x1="382" y1="250" x2="382" y2="270" stroke="#1f2937" strokeWidth="1" />
                <line x1="465" y1="250" x2="465" y2="270" stroke="#1f2937" strokeWidth="1" />
                <line x1="550" y1="250" x2="550" y2="270" stroke="#1f2937" strokeWidth="1" />

                {/* Labels */}
                <text x="50" y="290" textAnchor="middle" fontSize="12" fill="#6b7280">Jan</text>
                <text x="133" y="290" textAnchor="middle" fontSize="12" fill="#6b7280">Feb</text>
                <text x="216" y="290" textAnchor="middle" fontSize="12" fill="#6b7280">Mar</text>
                <text x="299" y="290" textAnchor="middle" fontSize="12" fill="#6b7280">Apr</text>
                <text x="382" y="290" textAnchor="middle" fontSize="12" fill="#6b7280">May</text>
                <text x="465" y="290" textAnchor="middle" fontSize="12" fill="#6b7280">Jun</text>
                <text x="550" y="290" textAnchor="middle" fontSize="12" fill="#6b7280">Jul</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Metrik Kinerja</h2>
            <span className="chart-type">Persentase Capaian</span>
          </div>
          <div className="performance-metrics">
            {performanceData.map((data, index) => (
              <div key={index} className="performance-item">
                <div className="performance-label">
                  <span className="label-text">{data.category}</span>
                  <span className="label-value">{data.percentage}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="statistics-section">
        <h2 className="section-title">Statistik Detail Operasional</h2>
        <div className="statistics-grid">
          <div className="stat-card-detailed">
            <div className="stat-icon">
              <BarChart3 size={32} color="#059669" />
            </div>
            <h3 className="stat-name">Total Patroli</h3>
            <p className="stat-number">856</p>
            <p className="stat-description">Patroli dilakukan bulan ini</p>
          </div>
          <div className="stat-card-detailed">
            <div className="stat-icon">
              <Users size={32} color="#059669" />
            </div>
            <h3 className="stat-name">Personel Terlatih</h3>
            <p className="stat-number">1,245</p>
            <p className="stat-description">Total personel terakreditasi</p>
          </div>
          <div className="stat-card-detailed">
            <div className="stat-icon">
              <AlertCircle size={32} color="#059669" />
            </div>
            <h3 className="stat-name">Insiden Tertangani</h3>
            <p className="stat-number">23</p>
            <p className="stat-description">Kasus terselesaikan bulan ini</p>
          </div>
          <div className="stat-card-detailed">
            <div className="stat-icon">
              <TrendingUp size={32} color="#059669" />
            </div>
            <h3 className="stat-name">Kepuasan Masyarakat</h3>
            <p className="stat-number">4.8/5</p>
            <p className="stat-description">Rating dari survei publik</p>
          </div>
        </div>
      </div>
    </div>
  );
}
