import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Report {
  id: number;
  title: string;
  category: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  status: 'generated' | 'pending' | 'failed';
  createdAt: Date;
  downloadUrl?: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ChartModule,
    MultiSelectModule,
    InputNumberModule,
    ToastModule
  ]
})
export class ReportComponent implements OnInit {
  activeTab: 'generate' | 'view' | 'export' = 'generate';
  showGenerateDialog = false;
  showViewDialog = false;
  showExportDialog = false;
  selectedReport: Report | null = null;
  selectedReports: Report[] = [];
  selectedFormat = 'pdf';

  reports: Report[] = [
    {
      id: 1,
      title: 'Monthly Team Performance',
      category: 'Performance',
      dateRange: {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31')
      },
      status: 'generated',
      createdAt: new Date('2024-03-15'),
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Task Completion Report',
      category: 'Tasks',
      dateRange: {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31')
      },
      status: 'pending',
      createdAt: new Date('2024-03-16')
    }
  ];

  newReport = {
    title: '',
    category: '',
    dateRange: {
      start: new Date(),
      end: new Date()
    }
  };

  categories = [
    { label: 'Performance', value: 'Performance' },
    { label: 'Tasks', value: 'Tasks' },
    { label: 'Attendance', value: 'Attendance' },
    { label: 'Projects', value: 'Projects' }
  ];

  exportFormats = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'excel' },
    { label: 'CSV', value: 'csv' }
  ];

  chartData: any;
  chartOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Task Completion',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
          borderWidth: 1
        },
        {
          label: 'Team Performance',
          data: [28, 48, 40, 19, 86, 27, 90],
          backgroundColor: '#10B981',
          borderColor: '#10B981',
          borderWidth: 1
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  generateReport() {
    if (this.newReport.title && this.newReport.category) {
      const report: Report = {
        id: this.reports.length + 1,
        title: this.newReport.title,
        category: this.newReport.category,
        dateRange: this.newReport.dateRange,
        status: 'pending',
        createdAt: new Date()
      };
      this.reports.push(report);
      this.showGenerateDialog = false;
      this.resetNewReport();
    }
  }

  resetNewReport() {
    this.newReport = {
      title: '',
      category: '',
      dateRange: {
        start: new Date(),
        end: new Date()
      }
    };
  }

  viewReport(report: Report) {
    this.selectedReport = report;
    this.showViewDialog = true;
  }

  downloadReport(report: Report, format: string) {
    // Implement download logic here
    console.log(`Downloading report ${report.id} in ${format} format`);
  }

  deleteReport(report: Report) {
    this.reports = this.reports.filter(r => r.id !== report.id);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'generated':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  exportSelectedReports() {
    if (this.selectedReports.length === 0) {
      console.log('No reports selected for export');
      return;
    }

    this.selectedReports.forEach(report => {
      this.downloadReport(report, this.selectedFormat);
    });

    this.selectedReports = [];
  }
} 