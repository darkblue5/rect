//index.js

import * as config from '../config/config.js';
// import * as echarts from '../../miniprogram_npm/ec-canvas/echarts.min.js';

const app = getApp();
const recorderManager = wx.getRecorderManager();

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',

    txtOption: true,
    nlpOption: false,

    //默认第一页
    currentData: 0,

    sen_count: 0,
    word_count: 0,
    errorCount: 0,     //错字数量
    totalCount: 28,    //四言绝句总字数: 4x7
    rate: 99,            //正确率百分比
    errHundred: 0,      //错字百位数字
    errTens: 0,         //错字十位数字
    errDigit: 0,        //错字个位数字

    ctext: [
      ['远', '上', '寒', '山', '石', '径', '斜'],
      ['白', '云', '生', '处', '有', '人', '家'],
      ['停', '车', '坐', '爱', '枫', '林', '晚'],
      ['霜', '叶', '红', '于', '二', '月', '花']
    ],

    rtext: [
      ['甲', '上', '寒', '山', '石', '径', '庚'],
      ['白', '乙', '生', '处', '有', '己', '家'],
      ['停', '车', '丙', '爱', '戊', '林', '晚'],
      ['霜', '叶', '红', '丁', '二', '月', '花']
    ],

    judg: [
      [false, true, true, true, true, true, false],
      [true, false, true, true, true, false, true],
      [true, true, false, true, false, true, true],
      [true, true, true, false, true, true, true]
    ],

    flag: false,
    time: 60 * 1000,
    timeData: {},

    //active是van-tabar属性类型是number
    active: 0,

    show: false, // popup window switch
    curGrade: '一年级上',
    curTitleIndex: 5,
    curTitle: config.title.一年级上[5].name,

    columns: [{
      values: Object.keys(config.title),
      className: 'column1'
    },
    {
      values: app.globalData.poet.一年级上,
      className: 'column2',
      defaultIndex: 2
    }
    ],

    pkOption: [],
    showView: true,

   // tmsg: '222',

    // rank page
    //  打卡日历日期
    days: [],
    signUp: [],
    cur_year: 0,
    cur_month: 0,
    count: 0,

    // 用户登陆信息
    txtGrade: '未知年级',
    rkNkname: '未知用户',

    // report page

    rank: [],

    nickName: '',
    grade: 0, //  用户所处年级
    firstUser: '',
    firstPoint: 1,
    secondUser: '',
    secondPoint: 2,
    thirdUser: '',
    thirdPoint: 3,
    fourthUser: '',
    fourthPoint: 4,

    // echarts
    // ecBar: {
    //   onInit: function (canvas, width, height) {
    //     let todayRate = 0;
    //     const chart = echarts.init(canvas, null, {
    //       width: width,
    //       height: height
    //     });

    //     canvas.setChart(chart);

    //     todayRate = 55;

    //     var option = {
    //       backgroundColor: "#ffffff",
    //       color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    //       series: [{
    //         name: '业务指标',
    //         type: 'gauge',
    //         detail: {
    //           formatter: '{value}%',
    //           textStyle: {
    //             color: '#ffffff',
    //             fontSize: 1,
    //           }
    //         },
    //         axisLine: {
    //           show: true,
    //           lineStyle: {
    //             width: 10,
    //             shadowBlur: 0,
    //             color: [
    //               [0.3, '#ffe3b3'],
    //               [0.7, '#64bd47'],
    //               [1, '#30a0e0']
    //             ]
    //           }
    //         },
    //         data: [{
    //           value: todayRate,
    //           //name: '完成率',
    //         }]

    //       }]
    //     };

    //     chart.setOption(option, true);

    //     return chart;
    //   }
    // },

    // ecScatter: {
    //   onInit: function (canvas, width, height) {
    //     const chart = echarts.init(canvas, null, {
    //       // width: 360,
    //       // height: 250
    //       width: width,
    //       height: height
    //     });
    //     canvas.setChart(chart);

    //     var now = new Date();
    //     var day = now.getDate();
    //     let i = 0;
    //     let dayData = [];
    //     let weekRate = [];
    //     //let crrRate = this.data.sevenRate;

    //     for (i = 7; i > 0; i--) {
    //       dayData[i - 1] = day - 7 + i;
    //     }

    //     //console.log(app.globalData.sevenRate);
    //     // if (app.globalData.sevenRate.length == 0)
    //     //     weekRate = [100, 100, 100, 100, 100, 100, 100];
    //     // else
    //     //   weekRate = app.globalData.sevenRate;
    //     weekRate = [99, 55, 33, 77, 22, 88, 11, 99, 11, 88];

    //     var option = {
    //       title: {
    //         text: '本周正确率(%)',
    //         textStyle: {
    //           color: '#000',
    //           fontSize: '14',
    //         },
    //         left: 'left'
    //       },
    //       color: ["#37A2DA"],
    //       // legend: {
    //       //   data: ['A'],
    //       //   top: 50,
    //       //   left: 'center',
    //       //   backgroundColor: 'red',
    //       //   z: 100
    //       // },
    //       // grid: {
    //       //   containLabel: true
    //       // },
    //       tooltip: {
    //         show: true,
    //         trigger: 'axis'
    //       },
    //       xAxis: {
    //         type: 'category',
    //         boundaryGap: false,
    //         // data: ['一', '二', '三', '四', '五', '六', '日', '一', '二', '三'],
    //         // data: ['一', '二', '三', '四', '五', '六', '日'],
    //         data: dayData,

    //         // x轴的字体样式
    //         axisLabel: {
    //           show: true,
    //           textStyle: {
    //             color: '#000',
    //             fontSize: '14',
    //           }
    //         },
    //         // 控制网格线是否显示
    //         splitLine: {
    //           show: true,
    //           //  改变轴线颜色
    //           lineStyle: {
    //             // 使用深浅的间隔色
    //             color: ['#aaaaaa']
    //           }
    //         },
    //         // x轴的颜色和宽度
    //         axisLine: {
    //           lineStyle: {
    //             color: '#000',
    //             width: 1,   //这里是坐标轴的宽度,可以去掉
    //           }
    //         }
    //         // show: false
    //       },

    //       yAxis: {
    //         x: 'center',
    //         type: 'value',
    //         splitLine: {
    //           lineStyle: {
    //             type: 'dashed'
    //           }
    //         },
    //         // data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

    //         // show: false
    //       },

    //       series: [{
    //         name: '正确率',
    //         type: 'line',
    //         smooth: false,
    //         data: weekRate
    //         //data: sevenRate
    //       }]

    //     };

    //     chart.setOption(option);
    //     return chart;
    //   }
    // }

  },

  onLoad: function () {
    let that = this;
    let pkData;


    //获取当前日期
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    wx.authorize({
      scope: 'record'
    })

    //console.log('index.js-->app.globalData.poet', app.globalData.poet);

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

    that.calculateEmptyGrids(cur_year, cur_month);
    that.calculateDays(cur_year, cur_month);

    //获取当前用户当前任务的签到状态
    //that.onGetSignUp();

    that.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch: weeks_ch,

      rank: [{
        nickname: '用户一',
        point: 400
      }, {
        nickname: '用户二',
        point: 300
      }, {
        nickname: '用户三',
        point: 200
      }, {
        nickname: '用户四',
        point: 100
      }]

    });

  },

  onChange(event) {
    console.log(event.detail);

    this.setData({
      page: event.detail,
      currentData: event.detail,
      timeData: event.detail,
    })
  },

  onTxtSwChange({detail}) {
    this.setData({
      txtOption: detail
    });
  },

  onNlpSwChange({detail}) {
    this.setData({
      nlpOption: detail
    });
  },

  //swiper滑动监听切换tabbar
  swiperChange(event) {
    console.log(event.detail.current)
    this.setData({
      active: event.detail.current
    })
  },

  startRect() {
    let that = this;

    const countDown = this.selectComponent('#counter');
    countDown.start();

    if (that.data.showView == true) {
      that.setData({
        showView: (!this.data.showView)
      });
    } else {
      that.onTmFinish();
    }

    recorderManager.start({});

  },

  onTmFinish() {
    let that = this;

    const countDown = this.selectComponent('#counter');
    countDown.reset();

    that.setData({
      showView: (!this.data.showView)
    });

    recorderManager.stop();

  },

  finishRect() {
    let that = this;

    if (that.data.showView == false) {
      that.onTmFinish();
    }
  },

  // pop window
  showPopup() {
    this.setData({
      show: true
    });
  },

  onIxPwClose() {
    this.setData({
      show: false
    });
  },

  // initial picker data
  onIxPkChange(event) {
    const {picker, value, index} = event.detail;

    picker.setColumnValues(1, app.globalData.poet[value[0]]);
  },

  onIxPkCancel(event) {
    this.setData({
      show: false
    });
  },

  onIxPkConfirm(event) {
    let that = this;
    let cgrade, ctitle;
    let i=0, j=0;
    let textArr = [[],[],[],[]];

    const { picker, value, index } = event.detail;

    cgrade = value[0];
    ctitle = value[1];

    for(i=0; i<config.title[cgrade][index[1]].type[0]; i++) {
      for(j=0; j<config.title[cgrade][index[1]].type[1]; j++) {
        textArr[i][j] = config.title[cgrade][index[1]].content[i][j];
      }
    }

    that.setData({
      curGrade: cgrade,
      curTitle: ctitle,
      curTitleIndex: index[1],

      sen_count: config.title[cgrade][index[1]].type[0],
      word_count: config.title[cgrade][index[1]].type[1],
      ctext: textArr,
      show: false
    });
  },

  // 获取当月共多少天
  getThisMonthDays: function (year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 获取当月第一天星期几
  getFirstDayOfWeek: function (year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids: function (year, month) {
    let that = this;

    //计算每个月时要清零
    that.setData({
      days: []
    });

    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        let obj = {
          date: null,
          isSign: false
        }
        that.data.days.push(obj);
      }
      this.setData({
        days: that.data.days
      });
      //清空
    } else {
      this.setData({
        days: []
      });
    }

  },

  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays: function (year, month) {
    let that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      let obj = {
        date: i,
        isSign: false
      }
      that.data.days.push(obj);
    }

    this.setData({
      days: that.data.days
    });
  },

  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign: function () {
    let that = this;
    let signs = that.data.signUp;
    let daysArr = that.data.days;

    // db.collection('loginRec').where({

    // }).get({
    //   success: res => {
    //     let count = 0;

    //     for (let j = 0; j < daysArr.length; j++) {
    //       //年月日相同并且已打卡signs
    //       if (res.data[0].rec[j] === 1) {
    //         daysArr[j].isSign = true;
    //         count++;
    //       }
    //     }

    //     that.setData({
    //       days: daysArr,
    //       count: count
    //     });
    //   }
    // })
  }

});

// 发送语音文件
function sendRecord(src) {
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1]

  let obj = {
    url: "http://47.100.2.222:3006/smart_order",

    method: "post",
    filePath: src,
    name: "wx_record",
    header: {
      'Content-Type': 'application/json'
    },

    success: function (result) {
      const reg = /[\u4e00-\u9fa5]/g;

      let i = 0, j = 0, k = 0;
      let hundred = 0, tens =0, digit = 0, total = 0, m=0;
      let tcount=0, rate=0;
      let textArr = [[], [], [], []];   //识别文字数组
      let judgArr = [[], [], [], []];   //判定结果数组
      let ctextArr = [[], [], [], []];  //原文文字数组
                                        //FIXME: 8句诗不适用
      let data = JSON.parse(result.data);
      let msg = data.result;
      let content = msg[0];
      let str;
      let ctext = config.title[curPage.data.curGrade][curPage.data.curTitleIndex].content;

      tcount = config.title[curPage.data.curGrade][curPage.data.curTitleIndex].type[0] * config.title[curPage.data.curGrade][curPage.data.curTitleIndex].type[1];

      if (msg !== null && msg !== '') {
        str = content.match(reg).join('')
      };

      for (i = 0; i < 4; i++) {
        for (j = 0; j < 7; j++) {
          textArr[i][j] = str[k++];
          if (ctext[i][j] === textArr[i][j]) {
            judgArr[i][j] = true;
          } else {
            judgArr[i][j] = false;
            total++;
          }
        }
      }

      hundred = parseInt(total / 100);
      m = total % 100;
      tens = parseInt(m / 10);
      digit = m % 10;

      rate = parseInt(((tcount - total) * 100) / tcount);

      console.log('index.js-->ctext[]:', ctext);
      console.log('index.js-->textArr[]:', textArr);
      console.log('index.js-->judgArr[]:', judgArr);
      console.log('total, tcount, rate', total, tcount, rate, '%')

      curPage.setData({
        //tmsg: '333'
        rtext: textArr,
        judg: judgArr,
        errHundred: hundred,
        errTens: tens,
        errDigit: digit,

        rate: rate
      });

    },

    fail: function (err) {
      console.log(err);
    }

  };

  wx.uploadFile(obj)
};

// 结束录音的时候触发 
recorderManager.onStop((res) => {
  // 获取文件路径-提交到后台-后台发送到百度
  sendRecord(res.tempFilePath);

  console.log('index.js-->onStop-->this', this);

  // console.log('onStop-->that', that);
});

recorderManager.onError((res) => {
  console.log("error", res);
});