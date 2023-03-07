import { Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { SessionService } from 'src/app/services/session.service';
import { ApiService } from "src/app/services/api.service";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexFill,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  plotOptions: ApexPlotOptions;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  colors: string[];
  labels: string[];
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./static-pages.scss'],
})
export class StatsPage implements OnInit {

  public chartOptions: Partial<ChartOptions>;
  public totals: {title: string, total: number}[];
  public programs: any;
  public programs_chart = false;

  constructor(
    public session: SessionService,
    private api: ApiService,
  ) {}

  ngOnInit() {
    console.log("ON INIT START", this.programs_chart);
    //this.totals = [{title: "Programas", total: 3200}, {title: "Contenedores", total: 3200}, {title: "Servicios", total: 3200}, {title: "Usuarios", total: 3200} ];
    this.programs = {
      total: 0,
      data: [],
      colors: ['#75AAF166', '#7BC00066', '#FFCB0266', '#D0021B66', '#0D633E66', '#F6914D66'],
      labels: []
    }
    this.session.getCountry().then( (country) => {
      if ( country != undefined ) {
        this.api.getStatsTotals().subscribe(
          (totals) => {
            console.log("TOTALS", totals);

            this.totals = totals;
          }
        );
        this.api.getStatsPrograms().subscribe(
          (categories) => {
            console.log("CATEGS", categories);
            categories.forEach( cat => {
              this.programs.labels.push(cat.name);
              this.programs.data.push(cat.total);
              this.programs.total += cat.total;
              console.log("TOT:", this.programs.total);
            });
          }
        );
      }
    });

    this.chartOptions = {
      series: [{
          data: this.programs.data,
        }],
      chart: {
        type: 'bar',
        height: 340
      },
      title: {
        text: "Programas / Total: " + this.programs.total,
        style: {
          fontFamily: 'Source Sans Pro',
          fontSize: '16px',
          fontWeight: '400',
          color: '#4A4A4A'
        },
      },
      labels: this.programs.labels,
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
        },
      },
      colors: this.programs.colors,
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        distributed: true,
        style: {
          fontSize: '13px',
          fontFamily: 'Source Sans Pro',
          fontWeight: '400',
          colors: ['#4A4A4A']
        },
        formatter: function (val, opt) {
          return opt.config.labels[opt.dataPointIndex]
        },
      },
      stroke: {
        width: 4,
        colors: ['#fff']
      },
      xaxis: {
        categories: this.programs.data,
        labels: {
          show: false,
        },
      },
      yaxis: {
        opposite: true,
        labels: {
          style: {
            fontFamily: 'Source Sans Pro',
            fontSize: '13px',
            fontWeight: 700
          }
        }
      },
      grid: {
        strokeDashArray: 1,
        position: 'front',
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      legend: {
        show: false
      },
      tooltip: {
        enabled: false,
      }
   };
  }
  ionViewDidEnter() {
    this.programs_chart = true;
    console.log("PRESENTTTT!!!", this.programs_chart);
    //window.dispatchEvent(new Event('resize'));
  }

  createChartOptions(section) {

  }
}
