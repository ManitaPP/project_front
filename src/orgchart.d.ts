declare module 'orgchart' {
    interface OrgChartNode {
      id: string;
      name: string;
      title: string;
      children?: OrgChartNode[];
    }
  
    export default class OrgChart {
      constructor(options: {
        'chart-container': string;
        data: OrgChartNode;
        nodeContent: string;
        draggable?: boolean;
      });
  
      // Other OrgChart methods can be added as needed
    }
  }
  