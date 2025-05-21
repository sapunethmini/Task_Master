import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { EmployeeService } from '../../../services/employee-service';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-task-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.css']
})
export class TeamOverviewComponent implements OnInit {
  // Priority data for donut chart
  priorityData = [
    { name: 'High', value: 35, color: '#EF4444' },
    { name: 'Medium', value: 45, color: '#F59E0B' },
    { name: 'Low', value: 20, color: '#10B981' }
  ];

  // Team data for bar chart with task distribution by priority
  teamData = [
    { 
      name: 'Alice', 
      tasks: 8, 
      color: '#3B82F6',
      tasksByPriority: { high: 3, medium: 3, low: 2 }
    },
    { 
      name: 'Bob', 
      tasks: 6, 
      color: '#8B5CF6',
      tasksByPriority: { high: 2, medium: 3, low: 1 }
    },
    { 
      name: 'Charlie', 
      tasks: 10, 
      color: '#10B981',
      tasksByPriority: { high: 4, medium: 4, low: 2 }
    },
    { 
      name: 'Diana', 
      tasks: 7, 
      color: '#F59E0B',
      tasksByPriority: { high: 2, medium: 3, low: 2 }
    },
    { 
      name: 'Eve', 
      tasks: 5, 
      color: '#EF4444',
      tasksByPriority: { high: 2, medium: 2, low: 1 }
    }
  ];

  // Task statistics
  taskStats = {
    total: 36,
    completed: 12,
    inProgress: 10,
    notStarted: 5,
    overdue: 2
  };

  // Team contact information
  teamLeader = {
    name: 'John Smith',
    title: 'Team Leader',
    email: 'john@example.com',
    phone: '(555) 123-4567'
  };

  // Progress circle properties
  completionPercentage = 68;
  radius = 85;
  circumference = 2 * Math.PI * this.radius;
  strokeDashoffset = 0;

  completedCount: number = 0;
  pendingCount: number = 0;
  memberCount: number = 0;

  constructor(private http: HttpClient, private taskService: TaskService, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    // Start with zero progress and animate to actual value
    this.strokeDashoffset = this.circumference;
    
    // Initialize charts
    setTimeout(() => {
      this.initPriorityChart();
      this.init3DBarChart();
      
      // Animate progress ring after a small delay for better visual effect
      setTimeout(() => {
        this.animateProgressRing();
      }, 300);
    }, 100);

    this.taskService.getTaskCountByStatus('COMPLETED').subscribe((count: number) => {
      this.completedCount = count;
    });

    this.taskService.getTaskCountByStatus('PENDING').subscribe((count: number) => {
      this.pendingCount = count;
    });

    const departmentId = 'YOUR_DEPARTMENT_ID'; // Replace with actual department id
    this.employeeService.getMemberCountByDepartment(departmentId).subscribe((count: number) => {
      this.memberCount = count;
    });
  }
  
  // Animate the progress ring
  animateProgressRing(): void {
    // Animate from 0 to the actual completion percentage
    let currentPercentage = 0;
    const targetPercentage = this.completionPercentage;
    const duration = 1500; // 1.5 seconds
    const intervalTime = 20; // Update every 20ms for smooth animation
    const steps = duration / intervalTime;
    const increment = targetPercentage / steps;
    
    const progressElement = document.querySelector('.progress-percentage') as HTMLElement;
    
    const interval = setInterval(() => {
      currentPercentage += increment;
      
      if (currentPercentage >= targetPercentage) {
        currentPercentage = targetPercentage;
        clearInterval(interval);
      }
      
      // Update the offset for the progress ring
      this.strokeDashoffset = this.circumference - (currentPercentage / 100) * this.circumference;
      
      // Update the percentage text
      if (progressElement) {
        progressElement.textContent = `${Math.round(currentPercentage)}%`;
      }
    }, intervalTime);
  }

  initPriorityChart(): void {
    const ctx = document.getElementById('priorityChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.priorityData.map(item => item.name),
          datasets: [{
            data: this.priorityData.map(item => item.value),
            backgroundColor: this.priorityData.map(item => item.color),
            borderWidth: 0,
            hoverOffset: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  return context.label + ': ' + context.raw + '%';
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }
  }

  init3DBarChart(): void {
    const container = document.getElementById('teamChart3D');
    if (!container) return;
    
    // Clear container first
    container.innerHTML = '';
    
    // Create 3D chart container and wrapper
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-3d-container';
    container.appendChild(chartContainer);
    
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-3d-wrapper';
    chartContainer.appendChild(chartWrapper);
    
    // Define base dimensions
    const barWidth = 40;
    const barDepth = 40;
    const spacing = 20;
    const maxBarHeight = 200;
    
    // Find the maximum task count to scale the bars properly
    const maxTasks = Math.max(...this.teamData.map(member => member.tasks));
    const heightScale = maxBarHeight / maxTasks;
    
    // Calculate wrapper width based on team data
    const wrapperWidth = this.teamData.length * (barWidth + spacing);
    chartWrapper.style.width = `${wrapperWidth}px`;
    chartWrapper.style.height = `${maxBarHeight + 50}px`; // Add extra height for labels
    
    // Add floor grid
    const gridDiv = document.createElement('div');
    gridDiv.className = 'chart-3d-grid';
    gridDiv.style.width = `${wrapperWidth + 100}px`;
    gridDiv.style.height = `${wrapperWidth + 100}px`;
    gridDiv.style.position = 'absolute';
    gridDiv.style.bottom = '0';
    gridDiv.style.left = `-50px`;
    gridDiv.style.backgroundImage = 'linear-gradient(rgba(226, 232, 240, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(226, 232, 240, 0.5) 1px, transparent 1px)';
    gridDiv.style.backgroundSize = '20px 20px';
    gridDiv.style.transform = 'rotateX(90deg)';
    gridDiv.style.transformOrigin = 'bottom';
    chartWrapper.appendChild(gridDiv);
    
    // Create 3D bars for each team member
    this.teamData.forEach((member, index) => {
      // Calculate position
      const xPos = index * (barWidth + spacing);
      
      // Calculate segment heights based on priority distribution
      const highPriorityHeight = member.tasksByPriority.high * heightScale;
      const mediumPriorityHeight = member.tasksByPriority.medium * heightScale;
      const lowPriorityHeight = member.tasksByPriority.low * heightScale;
      const totalHeight = highPriorityHeight + mediumPriorityHeight + lowPriorityHeight;
      
      // Create container for stacked bar segments
      const barContainer = document.createElement('div');
      barContainer.className = 'chart-3d-bar-container';
      barContainer.style.position = 'absolute';
      barContainer.style.left = `${xPos}px`;
      barContainer.style.bottom = '0';
      barContainer.style.width = `${barWidth}px`;
      barContainer.style.height = `${totalHeight}px`;
      barContainer.style.transformStyle = 'preserve-3d';
      barContainer.style.transition = 'transform 0.3s ease';
      chartWrapper.appendChild(barContainer);
      
      // Create label for the bar
      const label = document.createElement('div');
      label.className = 'chart-3d-bar-label';
      label.textContent = member.name;
      label.style.position = 'absolute';
      label.style.bottom = '-30px';
      label.style.width = `${barWidth}px`;
      label.style.textAlign = 'center';
      label.style.color = '#64748b';
      label.style.fontSize = '0.75rem';
      label.style.fontWeight = '600';
      label.style.transform = 'rotateX(-60deg) translateZ(20px)';
      barContainer.appendChild(label);
      
      // Create value label for the bar
      const valueLabel = document.createElement('div');
      valueLabel.className = 'chart-3d-bar-value';
      valueLabel.textContent = `${member.tasks}`;
      valueLabel.style.position = 'absolute';
      valueLabel.style.top = `${-25}px`;
      valueLabel.style.width = `${barWidth}px`;
      valueLabel.style.textAlign = 'center';
      valueLabel.style.color = '#1e293b';
      valueLabel.style.fontSize = '0.75rem';
      valueLabel.style.fontWeight = '600';
      valueLabel.style.transform = 'rotateX(-60deg) translateZ(20px)';
      barContainer.appendChild(valueLabel);
      
      // Create segments for each priority level (bottom to top)
      
      // 1. Low priority segment (bottom)
      if (lowPriorityHeight > 0) {
        this.createBarSegment(
          barContainer, 
          0, // Start from bottom
          lowPriorityHeight, 
          barWidth, 
          barDepth, 
          '#10B981' // Low priority color
        );
      }
      
      // 2. Medium priority segment (middle)
      if (mediumPriorityHeight > 0) {
        this.createBarSegment(
          barContainer, 
          lowPriorityHeight, // Start from top of low priority
          mediumPriorityHeight, 
          barWidth, 
          barDepth, 
          '#F59E0B' // Medium priority color
        );
      }
      
      // 3. High priority segment (top)
      if (highPriorityHeight > 0) {
        this.createBarSegment(
          barContainer, 
          lowPriorityHeight + mediumPriorityHeight, // Start from top of medium priority
          highPriorityHeight, 
          barWidth, 
          barDepth, 
          '#EF4444' // High priority color
        );
      }
    });
    
    // Add hover effect for the bars
    const bars = document.querySelectorAll('.chart-3d-bar-container');
    bars.forEach(bar => {
      bar.addEventListener('mouseenter', () => {
        (bar as HTMLElement).style.transform = 'translateY(-10px)';
      });
      
      bar.addEventListener('mouseleave', () => {
        (bar as HTMLElement).style.transform = 'translateY(0)';
      });
    });
  }
  
  createBarSegment(
    container: HTMLElement, 
    yOffset: number, 
    height: number, 
    width: number, 
    depth: number, 
    color: string
  ): void {
    // Create bar segment
    const segment = document.createElement('div');
    segment.className = 'chart-3d-bar';
    segment.style.position = 'absolute';
    segment.style.bottom = `${yOffset}px`;
    segment.style.width = `${width}px`;
    segment.style.height = `${height}px`;
    segment.style.transformStyle = 'preserve-3d';
    container.appendChild(segment);
    
    // Front face
    const front = document.createElement('div');
    front.className = 'chart-3d-bar-front';
    front.style.position = 'absolute';
    front.style.width = `${width}px`;
    front.style.height = `${height}px`;
    front.style.transform = `translateZ(${depth / 2}px)`;
    front.style.backgroundColor = color;
    segment.appendChild(front);
    
    // Back face
    const back = document.createElement('div');
    back.className = 'chart-3d-bar-back';
    back.style.position = 'absolute';
    back.style.width = `${width}px`;
    back.style.height = `${height}px`;
    back.style.transform = `translateZ(${-depth / 2}px)`;
    back.style.backgroundColor = this.adjustColorBrightness(color, -20);
    segment.appendChild(back);
    
    // Top face
    const top = document.createElement('div');
    top.className = 'chart-3d-bar-top';
    top.style.position = 'absolute';
    top.style.width = `${width}px`;
    top.style.height = `${depth}px`;
    top.style.top = '0';
    top.style.transform = 'rotateX(90deg)';
    top.style.transformOrigin = 'top';
    top.style.backgroundColor = this.adjustColorBrightness(color, 10);
    segment.appendChild(top);
    
    // Bottom face
    const bottom = document.createElement('div');
    bottom.className = 'chart-3d-bar-bottom';
    bottom.style.position = 'absolute';
    bottom.style.width = `${width}px`;
    bottom.style.height = `${depth}px`;
    bottom.style.bottom = '0';
    bottom.style.transform = 'rotateX(-90deg)';
    bottom.style.transformOrigin = 'bottom';
    bottom.style.backgroundColor = this.adjustColorBrightness(color, -10);
    segment.appendChild(bottom);
    
    // Left face
    const left = document.createElement('div');
    left.className = 'chart-3d-bar-left';
    left.style.position = 'absolute';
    left.style.width = `${depth}px`;
    left.style.height = `${height}px`;
    left.style.left = '0';
    left.style.transform = 'rotateY(-90deg)';
    left.style.transformOrigin = 'left';
    left.style.backgroundColor = this.adjustColorBrightness(color, -30);
    segment.appendChild(left);
    
    // Right face
    const right = document.createElement('div');
    right.className = 'chart-3d-bar-right';
    right.style.position = 'absolute';
    right.style.width = `${depth}px`;
    right.style.height = `${height}px`;
    right.style.right = '0';
    right.style.transform = 'rotateY(90deg)';
    right.style.transformOrigin = 'right';
    right.style.backgroundColor = this.adjustColorBrightness(color, -30);
    segment.appendChild(right);
  }
  
  // Helper function to adjust color brightness
  adjustColorBrightness(hex: string, percent: number): string {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // Adjust brightness
    r = Math.max(0, Math.min(255, r + Math.round(r * percent / 100)));
    g = Math.max(0, Math.min(255, g + Math.round(g * percent / 100)));
    b = Math.max(0, Math.min(255, b + Math.round(b * percent / 100)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}