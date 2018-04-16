export default {
  user: {
    _id: '',
    user: '',
    status: 0
  }, // 用户相关信息
  sidebarForStu: [
    {
      icon: 'el-icon-menu',
      index: '/home',
      title: '个人信息'
    },
    {
      icon: 'el-icon-upload2',
      index: '2',
      title: '信息提交',
      subs: [
        {
          index: '/home/updataMorality',
          title: '一.德育素质'
        },
        {
          index: '/home/updataPhysical',
          title: '二.体育素质'
        },
        {
          index: '/home/updataGPA',
          title: '三.智育素质'
        },
        {
          index: '/home/updataInnovation',
          title: '四.创新创业能力'
        },
        {
          index: '/home/updataSocialPracAbili',
          title: '五.社会实践能力'
        },
        {
          index: '/home/updataSocialWork',
          title: '六.社会工作能力'
        },
        {
          index: '/home/updataLiteAndSpo',
          title: '七.文体拓展素质'
        }
      ]
    }
    // {
    //   icon: 'el-icon-date',
    //   index: '3',
    //   title: '查看分数',
    //   subs: [
    //     {
    //       index: '/',
    //       title: '分数1'
    //     },
    //     {
    //       index: '/',
    //       title: '分数2'
    //     }
    //   ]
    // },
    // {
    //   icon: 'el-icon-star-on',
    //   index: 'basecharts',
    //   title: '图表'
    // },
    // {
    //   icon: 'el-icon-upload2',
    //   index: 'drag',
    //   title: '拖拽'
    // }
  ],
  sidebarForTeacher: [
    {
      icon: 'el-icon-menu',
      index: '/teacher',
      title: '个人信息'
    },
    {
      icon: 'el-icon-search',
      index: '/teacher/students',
      title: '学生基础信息查询'
    },
    {
      icon: 'el-icon-upload2',
      index: '/teacher/uploadstu',
      title: '批量学生账号上传'
    },
    {
      icon: 'el-icon-setting',
      index: '/teacher/setTime',
      title: '设置申报时间'
    },
    {
      icon: 'el-icon-edit',
      index: '/teacher/examine',
      title: '查看提交与审核'
    }
  ],
  sidebarForAdmin: [
    {
      icon: 'el-icon-menu',
      index: '/admin/students',
      title: '学生信息查询'
    },
    {
      icon: 'el-icon-menu',
      index: '/admin/teachers',
      title: '教师信息查询'
    },
    {
      icon: 'el-icon-upload2',
      index: '2',
      title: '批量账号上传',
      subs: [
        {
          index: '/admin/uploadstu',
          title: '学生账号上传'
        },
        {
          index: '/admin/uploadteah',
          title: '教师账号上传'
        }
      ]
    }
  ],
  studentScore: {
    score: {
      scoreItems: [{
        name: '德育素质',
        score: 0,
        status: '未提交'
      }, {
        name: '体育素质',
        score: 0,
        status: '未提交'
      }, {
        name: '智育素质',
        score: 0,
        status: '未提交'
      }, {
        name: '创新创业能力',
        score: 0,
        status: '未提交'
      }, {
        name: '社会实践能力',
        score: 0,
        status: '未提交'
      }, {
        name: '社会工作能力',
        score: 0,
        status: '未提交'
      }, {
        name: '社会工作能力',
        score: 0,
        status: '未提交'
      }]
    }
  }
}
