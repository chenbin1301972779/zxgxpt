<template>
	<div class="header-box">
		<span class="title">
			<img src="../../public/img/logo.png" alt="" @click="goHome">
		</span>
		<!-- <span class="info" v-if="$Cookies.get(this.$getCookieKey())"> -->
		<span>
			<!-- <el-input placeholder="请输入搜索内容" v-model="searchVal" class="input-with-select" style="width: 300px;margin-left: 100px;">
				<el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
			</el-input> -->
			<el-autocomplete @keyup.enter.native="searchData()"
							 @select="searchData"
							 class="inline-input"
							 v-model="searchVal"
							 :fetch-suggestions="querySearch"
							 placeholder="请输入搜索内容"
			  style="width: 300px;margin-left: 100px;">
				<el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
        <el-button slot="append"  icon="iconfont el-icon-mhcxdiqiu"  @click="searchBlarSearch" ></el-button>
			</el-autocomplete>
		</span>
		<span class="info" v-if="showUserData">
			<el-dropdown style="margin-right:20px" @command="handleCommand">
				<el-button type="primary" round>
					常用应用<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="1" v-if="blacklistApply">黑名单申报</el-dropdown-item>
					<el-dropdown-item command="2" v-if="blacklistAudit">黑名单审批</el-dropdown-item>
					<el-dropdown-item command="3" v-if="merchant">客商初筛</el-dropdown-item>
					<el-dropdown-item command="4" v-if="zxbReportApply">信保报告申请</el-dropdown-item>
					<el-dropdown-item command="7" v-if="zxbReportlist">信保报告列表</el-dropdown-item>
					<el-dropdown-item command="10" v-if="zxbreportAudit">信保报告审核</el-dropdown-item>
					<el-dropdown-item command="5" v-if="userManage||sub_manage">用户管理</el-dropdown-item>
          <el-dropdown-item command="11" v-if="$Cookies.get('username')=='admin'">角色管理</el-dropdown-item>
					<el-dropdown-item command="6" v-if="newsAll">消息中心</el-dropdown-item>
          <el-dropdown-item command="8" v-if="this.$Cookies.get('username')=='admin'">访问日志</el-dropdown-item>
          <el-dropdown-item command="9" v-if="this.$Cookies.get('username')=='admin'">组织架构维护</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-button type="success" round v-if="showLargeBtn&&$route.path=='/essInfo'" @click="larger" class="el-icon-full-screen"> 全屏</el-button>
			<el-divider direction="vertical"></el-divider>
			<span style="margin-right: 20px;" @click="showUserInfo">
				<i class="el-icon-user-solid"></i>
				{{$Cookies.get('username')}}</span>
			<el-divider direction="vertical"></el-divider>
			<span style="cursor: pointer;" @click="logOut">安全退出</span>
		</span>
		<el-button type="primary" v-else @click="openLoginDialog" style="float:right;margin-top: 12px;">登录</el-button>
		<!-- <span class="info" v-else @click="openLoginDialog">登录</span> -->
		<el-dialog title="登录" :visible.sync="dialogVisible" width="450px">
			<el-form :model="form" label-width="100px">
				<el-form-item label="用户名">
					<el-input v-model="form.username" style="width:250px"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="form.password" style="width:250px" type="password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="login">登 录</el-button>
			</div>
		</el-dialog>

		<el-dialog title="账号设置" :visible.sync="userSettingDialog" width="450px">
			<el-form :model="userSettingForm">
				<el-form-item label="用户名：" label-width="100px">
					<el-input v-model="userSettingForm.username" disabled style="width:250px"></el-input>
				</el-form-item>
				<el-form-item label="姓名：" label-width="100px">
					<el-input v-model="userSettingForm.name" style="width:250px"></el-input>
				</el-form-item>
				<el-form-item label="密码：" label-width="100px">
					<el-input v-model="userSettingForm.password" style="width:250px" type="password">
					</el-input>
				</el-form-item>
				<el-form-item label="手机：" label-width="100px">
					<el-input v-model="userSettingForm.mobile" style="width:250px"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：" label-width="100px">
					<el-input v-model="userSettingForm.email" style="width:250px"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="userSettingDialog = false">取 消</el-button>
				<el-button type="primary" @click="saveUserInfo">保 存</el-button>
			</div>
		</el-dialog>

		<ZxbReportApply :dialogXBVisible.sync="dialogXBVisible"></ZxbReportApply>
	</div>
</template>

<script>
	import ZxbReportApply from "./zxbReportApply";
	export default {
    inject: ['reload'],
    components: {
      ZxbReportApply,
    },
    data() {
      return {
        dialogVisible: false,
        form: {
          username: '',
          password: ''
        },
        loginUserName: '',
        userSettingDialog: false,
        userSettingForm: {
          // username: this.$Cookies.get('username'),
          username: this.$Cookies.get('userCode'),
          name: '',
          password: '',
          email: '',
          mobile: ''
        },
        showUserData: sessionStorage.getItem('username'),
        blacklistAudit: false,
        userManage: false,
        sub_manage: false,
        merchant:false,
        zxbreportAudit: false,
        blacklistApply: false,
        newsAll:false,
        zxbReportApply:false,
        zxbReportlist:false,
        dialogXBVisible: false,
        searchVal: '',
        latestSearchList: [],
        showLargeBtn: false
      }
    },
    created() {
      this.showLargeBtn = false;
      if (this.$route.query.index == '1') {
        this.showLargeBtn = true;
      }
      this.$Bus.$on('showDialog', () => {
        this.dialogVisible = true;
      });
      this.$Bus.$on('showLargeBtn', (data) => {
        if (data == '1') {
          this.showLargeBtn = true;
        } else {
          this.showLargeBtn = false;
        }

      })
    },
    mounted() {
      if (this.$route.query.username) {
        this.skipLogin();
      }
      if (this.$route.query.searchVal) {
        this.searchVal = this.$route.query.searchVal;
      }
      this.verifyPermissions();
      this.getLatestSearchList();
    },
    methods: {
      larger() {
        this.$Bus.$emit('largerWindow')
      },
      getNationCode() {
        this.$ajax.manage.getNationCode({}).then(res => {
          console.log(res);
          if (res.status == 200) {
            this.nationTypeOptions = res.data.nationCode
          }
        })
      },
      getLatestSearchList() {
        let param = {
          userId: this.$Cookies.get('userId')
        }
        this.$ajax.manage.latestWords(param).then(res => {
          console.log(res)
          if (res.status == 200) {
            this.latestSearchList = res.data.latestWords.map(row => {
              row.value = row.keyWord;
              return row
            })
            console.log('主档裤查询')
            console.log(res.data.latestWords)
          }
        })
      },
      querySearch(queryString, cb) {
        console.log(queryString)
        var latestSearchList = this.latestSearchList;
        var results = queryString ? latestSearchList.filter(this.createFilter(queryString)) : latestSearchList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      searchData() {
        if (this.searchVal == '') {
          this.$message.warning('请输入搜索内容');
          return;
        } else {
          this.$router.push({
            path: '/searchResult',
            query: {
              searchVal: this.searchVal,
              isBlar: false
            }
          });

          this.getLatestSearchList();
        }
      },
      verifyPermissions() {
        //权限
        let param = {
          userId: this.$Cookies.get("userId"),
          permissionPoint: "user.manage,user.sub_manage,blacklist.audit,blacklist.apply,zxbreport.audit,merchant.screening,news.all,zxbreport.apply,zxbreport.list"
        }
        this.$ajax.manage.verifyPermissions(param).then(res => {
          console.log(res)
          if (res.data.code == 0) {
            this.blacklistAudit = res.data.verifyPermissionResult['blacklist.audit'];
            this.blacklistApply = res.data.verifyPermissionResult['blacklist.apply'];
            this.userManage = res.data.verifyPermissionResult['user.manage'];
            this.sub_manage = res.data.verifyPermissionResult['user.sub_manage'];
            this.zxbreportAudit = res.data.verifyPermissionResult['zxbreport.audit'];
            this.merchant = res.data.verifyPermissionResult['merchant.screening'];
            this.newsAll = res.data.verifyPermissionResult['news.all'];
            this.zxbReportApply = res.data.verifyPermissionResult['zxbreport.apply'];
            this.zxbReportlist  = res.data.verifyPermissionResult['zxbreport.list'];
            if (this.userManage || this.sub_manage) {
              this.$Cookies.set('userManage', 'true');
            }
          }
        })
      },
      handleCommand(command) {
        if (command == 1) {
          //黑名单申报
          this.goHmdsb()
        } else if (command == 2) {
          //黑名单审批
          this.goHmdsp()
        } else if (command == 3) {
          //客商初筛
          this.goKstb()
        } else if (command == 4) {
          //信保报告申请
          this.applyReport()
        } else if (command == 5) {
          //用户管理
          if (this.$Cookies.get('username') != 'admin' && this.$Cookies.get('userManage') != 'true') {
            this.$message.warning('您暂没有查看该功能的权限，请联系管理员')
          } else {
            //55109783
            this.$router.push({
              path: '/userManage'
            })
          }
        } else if (command == 6) {
          this.$router.push({
            path: '/messageCenter'
          })
        } else if (command == 7) {
          this.$router.push({path: '/zxbReportList'})
        } else if (command == 8) {
          this.goLog()
        } else if (command == 9) {
          this.goOrgEdit()
        } else if (command == 10) {
          this.$router.push({path: '/ZxbApplyList'})
        }else if(command == 11){
          this.$router.push({ path: '/RoleManage' })
        }
      },
      goHmdsb() {
        this.$router.push({
          path: '/iframePage',
          query: {
            title: encodeURIComponent('黑名单申报'),
            url: encodeURIComponent(
                `${process.env.VUE_APP_FR_URL}/webroot/decision/view/form?viewlet=/Homepage/BlackList.cpt&op=write&userCode=${sessionStorage.getItem('userCode')}`
            )
          }
        })
        this.reload()
      },
      goHmdsp() {
        this.$router.push({
          path: '/iframePage',
          query: {
            title: encodeURIComponent('黑名单审批'),
            url: encodeURIComponent(
                `${process.env.VUE_APP_FR_URL}/webroot/decision/view/form?viewlet=/Homepage/BlackList_check.cpt&op=write&userCode=${sessionStorage.getItem('userCode')}`
            )
          }
        })
        this.reload()
      },
      goKstb() {
        this.$router.push({
          path: '/iframePage',
          query: {
            title: encodeURIComponent('客商填报'),
            url: encodeURIComponent(
                `${process.env.VUE_APP_FR_URL}/webroot/decision/view/form?viewlet=/Homepage/Merchants_Input.cpt&op=write&userCode=${sessionStorage.getItem('userCode')}`
            )
          }
        })
        this.reload()
      },
      goLog() {
        this.$router.push({
          path: '/iframePage',
          query: {
            title: encodeURIComponent('访问日志'),
            url: encodeURIComponent(
                `${process.env.VUE_APP_FR_URL}/webroot/decision/view/form?viewlet=/Homepage/LOG.frm&userCode=${sessionStorage.getItem('userCode')}`
            )
          }
        })
        this.reload()
      },
      goOrgEdit() {
        this.$router.push({
          path: '/iframePage',
          query: {
            title: encodeURIComponent('组织架构维护'),
            url: encodeURIComponent(
                `${process.env.VUE_APP_FR_URL}/webroot/decision/view/form?viewlet=/Homepage/组织架构树填报.frm&userCode=${sessionStorage.getItem('userCode')}`
            )
          }
        })
        this.reload()
      },
      openLoginDialog() {
        //打开登录弹框
        this.dialogVisible = true;
      },
      login() {
        //登录
        if (this.form.username === '') {
          this.$message.warning('请输入用户名');
          return;
        } else if (this.form.password === '') {
          this.$message.warning('请输入密码');
          return;
        }
        let param = {
          username: this.form.username,
          password: this.form.password,
        }
        this.$ajax.manage.login(param).then(res => {
          console.log(res);
          if (res.data.code === '0') {
            this.$Cookies.set(this.$getCookieKey(), res.data.token, {
              expires: 30
            });
            this.$Cookies.set('username', res.data.name, {
              expires: 30
            });
            this.$Cookies.set('userCode', res.data.username, {
              expires: 30
            });
            this.$Cookies.set('userId', res.data.userId, {
              expires: 30
            });
            sessionStorage.setItem('username', res.data.name);
            sessionStorage.setItem('userCode', res.data.username);
            sessionStorage.setItem('userId', res.data.userId);
            this.dialogVisible = false;
            this.loginUserName = res.data.name;
            //this.reload()
            this.$router.push({
              path: '/homePage'
            });
            this.reload()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      logOut() {
        //退出
        this.$Cookies.remove(this.$getCookieKey());
        this.$Cookies.remove('username');
        this.$Cookies.remove('userCode');
        this.$Cookies.remove('userId');
        this.$Cookies.remove('companyCode');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userCode');
        sessionStorage.removeItem('userId');
        this.$router.push({
          path: '/'
        });
        this.reload()
        // this.$router.go(0);
      },
      skipLogin() {
        let param = {
          username: this.$route.query.username,
          loginType: 'skip',
        }
        this.$ajax.manage.login(param).then(res => {
          console.log(res);
          if (res.data.code === '0') {
            this.$Cookies.set(this.$getCookieKey(), res.data.token, {
              expires: 30
            });
            this.$Cookies.set('username', res.data.name, {
              expires: 30
            });
            this.$Cookies.set('userCode', res.data.username, {
              expires: 30
            });
            this.$Cookies.set('userId', res.data.userId, {
              expires: 30
            });
            sessionStorage.setItem('username', res.data.name);
            sessionStorage.setItem('userCode', res.data.username);
            sessionStorage.setItem('userId', res.data.userId);
            this.loginUserName = res.data.name;
            this.$router.push({
              path: '/homePage'
            });
            this.reload()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      showUserInfo() {
        //维护用户基本信息弹框
        this.userSettingDialog = true;
        this.getUserInfo()
      },
      getUserInfo() {
        //获取用户信息
        let param = {
          userId: this.$Cookies.get("userId")
        };
        this.$ajax.manage.getUserInfo(param).then(res => {
          console.log(res);
          if (res.status == 200) {
            this.userSettingForm.name = res.data.user.name;
            this.userSettingForm.password = res.data.user.password;
            this.userSettingForm.email = res.data.user.email;
            this.userSettingForm.mobile = res.data.user.mobile;
          }
        })
      },
      saveUserInfo() {
        let param = {
          userId: this.$Cookies.get("userId"),
          username: this.$Cookies.get("userCode"),
          name: this.userSettingForm.name,
          password: this.userSettingForm.password,
          email: this.userSettingForm.email,
          mobile: this.userSettingForm.mobile
        }
        this.$ajax.manage.updateUser(param).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.$message.success(res.data.msg);
            this.userSettingDialog = false
          }
        })
      },
      clearUserForm() {
        this.userSettingForm = {
          // username: this.$Cookies.get('username'),
          username: this.$Cookies.get('userCode'),
          name: '',
          password: '',
          email: '',
          mobile: ''
        }
      },
      goHome() {
        //
        console.log(this.$route);
        this.$router.push({
          path: '/homePage'
        });
        // if (this.$route.path == '/') {
        //     this.reload();
        // } else {
        //     this.$router.push({ path: '/' });
        // }
      },
      applyReport() {
        //打开报告申请弹框
        this.dialogXBVisible = true;
      },
      searchBlarSearch() {
        if (this.searchVal == '') {
          this.$message('请输入搜索内容');
          return;
        } else {
          this.$router.push({
            path: '/searchResult',
            query: {
              searchVal: this.searchVal,
              isBlar: true
            }
          });
        }
      }
    }
  }
</script>
<style>
	.el-dropdown-link {
		cursor: pointer;
		color: #333333;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}
</style>
<style lang="less" scoped>
	.header-box {

		// background: url(../../public/img/header.png) no-repeat;
		// background-size: cover;
		.el-dropdown/deep/ {
			height: 40px;
			//float: right;
		}

		.el-dialog__header/deep/ {
			line-height: 20px;
		}

		line-height: 60px;
		white-space: nowrap;
		overflow: hidden;
		//margin-bottom: 10px;
		// background: #1b7fbd;
		background-color: #fff;
		padding: 0 60px;
		position: relative;

		img {
			height: 40px;
			cursor: pointer;
		}


		.title {
			font-size: 16px;
			font-weight: bold;
			color: rgba(71, 140, 209, 1);
			margin-left: 16px;
			//color: #fff;
			color: #333333;

			img {
				vertical-align: middle;
			}
		}

		.info {
			float: right;
			margin-right: 38px;
			font-size: 16px;
			color: #333333;
			cursor: pointer;
			color: #333333;

			span {
				&:hover {
					color: #409eff;
				}
			}

			.infoImg {
				display: inline-block;
				width: 20px;
				height: 20px;
				vertical-align: middle;
				margin-right: 6px;
			}
		}


	}
</style>
