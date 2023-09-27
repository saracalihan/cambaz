class TreeNode {
  id: string;
  childs: TreeNode[];
  datas: any;
  styles: any;  
  methods: {
    [key: string]: Function
  }
  /**
   *
   */
  constructor() {
    this.id = '';
    this.childs = [];
    this.datas = {},
      this.methods = {}
  }

  addChild(data: any) {
    this.childs.push(data);
  }
}