import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  totalInstituicoes = 0;
  campanhasAtivas = 0;
  campanhasInativas = 0;
  statusItens: any = { URGENTE: 0, SUFICIENTE: 0, INSUFICIENTE: 0 };

  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Campanhas Ativas', 'Campanhas Inativas'],
    datasets: [{
      data: [],
      backgroundColor: ['#3498db', '#95a5a6']
    }]
  };

  barChartData: ChartData<'bar', number[], string> = {
    labels: ['Urgente', 'Suficiente', 'Insuficiente'],
    datasets: [{
      label: 'Status dos Itens',
      data: [],
      backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71']
    }]
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.http.get<any>('http://localhost:8080/admin/dashboard').subscribe((data) => {
      this.totalInstituicoes = data.totalInstituicoes;
      this.campanhasAtivas = data.campanhasAtivas;
      this.campanhasInativas = data.campanhasInativas;
      this.statusItens = data.statusItens;

      this.pieChartData = {
        labels: ['Campanhas Ativas', 'Campanhas Inativas'],
        datasets: [{
          data: [this.campanhasAtivas, this.campanhasInativas],
          backgroundColor: ['#3498db', '#95a5a6']
        }]
      };

      this.barChartData = {
        labels: ['Urgente', 'Suficiente', 'Insuficiente'],
        datasets: [{
          label: 'Status dos Itens',
          data: [
            this.statusItens.URGENTE || 0,
            this.statusItens.SUFICIENTE || 0,
            this.statusItens.INSUFICIENTE || 0
          ],
          backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71']
        }]
      };
    });
  }

  exportarPDF(): void {
    const element = document.getElementById('dashboard-relatorio');
    if (!element) return;

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('relatorio-dashboard.pdf');
    });
  }
}
