import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

  public chartPrograms: Partial<ChartOptions>;
  public chartContainers: Partial<ChartOptions>;
  public chartServices: Partial<ChartOptions>;
  public chartUsers: Partial<ChartOptions>;
  public totals: {title: string, total: number}[];
  public programs = 0;
  public containers = 0;
  public services = 0;
  public users = 0;
  public programs_total = 0;
  public services_total = 0;

  constructor(
    public session: SessionService,
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.session.countryChanged.subscribe(
      countryName => {
        this.createChartOptions();
        if ( countryName != '' ) {
          this.load_graph_data();
        }
      }
    );
  }
  /*ionViewDidEnter() {
    this.initiated = true;
  }*/
  load_graph_data() {
    //restart charts
    this.programs = 0;
    this.containers = 0;
    this.services = 0;
    this.users = 0;
    this.api.getStatsTotals().subscribe(
      (totals) => {
        this.totals = totals;
        this.programs_total = totals[0].total;
        this.services_total = totals[2].total;
      }
    );
    this.api.getStatsPrograms().subscribe(
      (progs) => {
        var progtotal = 0;
        var series = [];
        this.chartPrograms.chart.height = 50 * (progs.length + 2);
        progs.forEach( prog => {
          this.chartPrograms.labels.push(prog.name);
          series.push(prog.total);
          this.chartPrograms.xaxis.categories.push(prog.total);
          progtotal += prog.total;
        });
        this.chartPrograms.title.text = "Programas / Total: " + progtotal;
        this.chartPrograms.series[0].data = series;
        this.programs = progtotal;
      }
    );
    this.api.getStatsContainers().subscribe(
      (conts) => {
        var conttotal = 0;
        var series = [];
        this.chartContainers.chart.height = 40 * (conts.length + 1);
        conts.forEach( cont => {
          this.chartContainers.labels.push(cont.name);
          series.push(cont.total);
          this.chartContainers.xaxis.categories.push(cont.total);
          conttotal += cont.total;
        });
        this.chartContainers.series[0].data = series;
        this.chartContainers.title.text = "Contenedores / Total: " + conttotal;
        this.containers = conttotal;
      }
    );
    this.api.getStatsServices().subscribe(
      (servs) => {
        var servtotal = 0;
        var series = [];
        this.chartServices.chart.height = 40 * (servs.length + 1);
        servs.forEach( serv => {
          this.chartServices.labels.push(serv.name);
          series.push(serv.total);
          this.chartServices.xaxis.categories.push(serv.total);
          servtotal += serv.total;
        });
        this.chartServices.series[0].data = series;
        this.chartServices.title.text = "Servicios / Total: " + servtotal;
        this.services = servtotal;
      }
    );
    this.api.getStatsUsers().subscribe(
      (usrs) => {
        var usrtotal = 0;
        var series = [];
        this.chartUsers.chart.height = 40 * (usrs.length + 1);
        usrs.forEach( usr => {
          let name = usr.name == '' || usr.name == null ? 'Sin dato' : usr.name;
          this.chartUsers.labels.push(name);
          series.push(usr.total);
          this.chartUsers.xaxis.categories.push(usr.total);
          usrtotal += usr.total;
        });
        this.chartUsers.series[0].data = series;
        this.chartUsers.title.text = "Programas / Total: " + usrtotal;
        this.users = usrtotal;
      }
    );
  }
  createChartOptions() {
    const chartOptions = {
      series: [{
        data: [],
      }],
      chart: {
        type: 'bar',
      },
      title: {
        text: "",
        style: {
          fontFamily: 'SourceSansPro',
          fontSize: '16px',
          fontWeight: '400',
          color: '#4A4A4A'
        },
      },
      labels: [],
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom'
          },
        },
      },
      colors: ['#75AAF166', '#7BC00066', '#FFCB0266', '#D0021B66', '#0D633E66', '#F6914D66'],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        distributed: true,
        style: {
          fontSize: '13px',
          fontFamily: 'SourceSansPro',
          fontWeight: '400',
          colors: ['#4A4A4A'],
          lineHeight: '13px'
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
        categories: [],
        labels: {
          show: false,
        },
      },
      yaxis: {
        opposite: true,
        labels: {
          minWidth: 50,
          style: {
            fontFamily: 'SourceSansPro',
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
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            legend: {
              position: 'bottom'
            },
          }
        }
      ]
    };
    this.chartPrograms = JSON.parse(JSON.stringify(chartOptions));
    this.chartPrograms.dataLabels.formatter = function (val, opt) {return opt.config.labels[opt.dataPointIndex]};
    this.chartContainers = JSON.parse(JSON.stringify(chartOptions));
    this.chartContainers.dataLabels.formatter = function (val, opt) {return opt.config.labels[opt.dataPointIndex]};
    this.chartServices = JSON.parse(JSON.stringify(chartOptions));
    this.chartServices.dataLabels.formatter = function (val, opt) {return opt.config.labels[opt.dataPointIndex]};
    this.chartUsers = JSON.parse(JSON.stringify(chartOptions));
    this.chartUsers.dataLabels.formatter = function (val, opt) {return opt.config.labels[opt.dataPointIndex]};
  }
  onTabClick(event) {
    //Fix not showing problem
    window.dispatchEvent(new Event('resize'));
  }
}
