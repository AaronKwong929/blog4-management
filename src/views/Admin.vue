<template>
    <div v-loading.fullscreen.lock="loading" id="admin">
        <div class="tool-bar">
            <el-button
                size="small"
                @click.prevent.native="openStatusDialog"
                class="tool-bar-item"
                type="success"
                >最近状态</el-button
            >
            <el-button
                size="small"
                @click.prevent.native="openEventTrackDialog"
                class="tool-bar-item"
                type="primary"
                >埋点日志</el-button
            >
            <el-button
                @click.prevent.native="logout"
                type="danger"
                size="small"
                class="tool-bar-item"
                >退出</el-button
            >
        </div>
        <div class="tool-bar" style="margin-bottom: 1rem;">
            <el-select
                size="small"
                v-model="searchForm.type"
                clearable
                placeholder="类型"
                class="tool-bar-item"
            >
                <el-option
                    v-for="(item, index) in typeOptions"
                    :key="`type` + index"
                    :value="item.value"
                    :label="item.label"
                ></el-option>
            </el-select>
            <el-select
                size="small"
                v-model="searchForm.tag"
                clearable
                placeholder="标签"
                class="tool-bar-item"
                ><el-option
                    v-for="(item, index) in tagOptions"
                    :key="`tag` + index"
                    :value="item.value"
                    :label="item.label"
                ></el-option
            ></el-select>
            <el-select
                size="small"
                v-model="searchForm.published"
                clearable
                placeholder="状态"
                class="tool-bar-item"
                ><el-option
                    v-for="(item, index) in publishOptions"
                    :key="`published` + index"
                    :value="item.value"
                    :label="item.label"
                ></el-option>
            </el-select>
            <el-button
                type="success"
                size="small"
                @click.prevent.native="getArticle"
                class="tool-bar-item"
                >搜索</el-button
            >
            <el-button
                type="primary"
                size="small"
                @click.prevent.native="newArticle"
                class="tool-bar-item"
                >新建</el-button
            >
            <el-button
                size="small"
                @click.prevent.native="reset"
                class="tool-bar-item"
                >刷新</el-button
            >
        </div>
        <el-container style="height: 75vh;">
            <el-main>
                <el-table
                    ref="articleTable"
                    :data="articleList"
                    border
                    row-key="_id"
                    tooltip-effect="dark"
                    style="width: 99%;"
                    height="100%"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                        prop="updatedAt"
                        label="发布日期"
                        min-width="20"
                        align="center"
                        :formatter="dateFormat"
                    ></el-table-column>
                    <el-table-column
                        prop="title"
                        label="标题"
                        min-width="30"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="type"
                        label="类型"
                        min-width="10"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="tag"
                        label="标签"
                        min-width="10"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="published"
                        label="状态"
                        min-width="10"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.published">已发布</span>
                            <span v-else>未发布</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="25" align="center">
                        <template slot-scope="scope">
                            <el-button
                                icon="el-icon-s-promotion"
                                size="small"
                                @click.prevent.native="
                                    changeArticleStatus(scope.row)
                                "
                                type="text"
                                >{{
                                    scope.row.published ? '撤回' : '发布'
                                }}</el-button
                            >
                            <el-button
                                icon="el-icon-edit"
                                size="small"
                                @click.prevent.native="
                                    pushToDraft(scope.row._id)
                                "
                                type="text"
                                :disabled="scope.row.published"
                                >编辑</el-button
                            >
                            <el-button
                                @click.prevent.native="
                                    getComment(scope.row._id)
                                "
                                size="small"
                                type="text"
                                >评论管理</el-button
                            >
                            <el-button
                                icon="el-icon-delete"
                                size="small"
                                @click.prevent.native="deleteArticle(scope.row)"
                                type="text"
                                :disabled="scope.row.published"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer
                style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                "
            >
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="articleListCount"
                    :page-sizes="[20, 50, 100]"
                    background
                    :page-size.sync="pageSize"
                    :current-page.sync="pageIndex"
                    @current-change="val => handlePageIndexChange(val, 1)"
                    @size-change="val => handlePageSizeChange(val, 1)"
                ></el-pagination>
            </el-footer>
        </el-container>
        <el-dialog
            title="评论管理"
            :visible.sync="commentDialog"
            :append-to-body="true"
            :lock-scroll="true"
            :close-on-click-modal="false"
            width="80%"
        >
            <el-table
                ref="commentTable"
                :data="commentList"
                border
                row-key="_id"
                tooltip-effect="dark"
                style="width: 99%;"
                height="55vh"
                :row-class-name="tableRowClassName"
            >
                <el-table-column
                    prop="updatedAt"
                    label="发布时间"
                    min-width="10"
                    align="center"
                    :formatter="dateFormat"
                ></el-table-column>
                <el-table-column
                    prop="user"
                    label="作者ID"
                    min-width="10"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="content"
                    label="内容"
                    min-width="20"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="操作" min-width="10" align="center">
                    <template slot-scope="scope">
                        <el-button
                            @click.prevent.native="
                                changeCommentStatus(scope.row)
                            "
                            type="text"
                            size="small"
                        >
                            {{ scope.row.published ? `隐藏` : `展示` }}
                        </el-button>
                        <el-button
                            @click.prevent.native="deleteComment(scope.row)"
                            type="text"
                            size="small"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination
                    background
                    :total="commentListCount"
                    :current-page.sync="commentPageIndex"
                    @current-change="val => handlePageIndexChange(val, 2)"
                ></el-pagination>
            </el-row>
        </el-dialog>
        <el-dialog
            title="埋点日志"
            :visible.sync="eventTrackDialog"
            :append-to-body="true"
            :lock-scroll="true"
            :close-on-click-modal="false"
            width="60%"
        >
            <el-container>
                <el-main>
                    <el-table
                        ref="eventTrackList"
                        :data="eventTrackList"
                        border
                        tooltip-effect="dark"
                        style="width: 99%;"
                    >
                        <el-table-column
                            align="center"
                            prop="updatedAt"
                            label="操作时间"
                            :formatter="dateFormat"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="eventCode"
                            label="事件"
                        >
                            <template slot-scope="scope">
                                {{ eventCodeList[scope.row.eventCode] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="eventStatus"
                            label="状态"
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.eventStatus === 0"
                                    >成功</span
                                >
                                <span v-else>失败</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer
                    style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                "
                >
                    <el-pagination
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="eventTrackListCount"
                        :current-page.sync="eventTrackPageIndex"
                        @current-change="val => handlePageIndexChange(val, 3)"
                        :page-size.sync="eventTrackPageSize"
                        :page-sizes="[10, 20, 50]"
                        @size-change="val => handlePageSizeChange(val, 3)"
                    ></el-pagination>
                </el-footer>
            </el-container>
        </el-dialog>
        <el-dialog
            title="最近状态"
            :visible.sync="statusDialog"
            :append-to-body="true"
            :lock-scroll="true"
            :close-on-click-modal="false"
        >
            <el-container>
                <el-main>
                    <el-header>
                        <div class="tool-bar">
                            <el-button
                                class="tool-bar-item"
                                @click.prevent.native="addStatusDialog = true"
                                size="small"
                                type="primary"
                                >新建</el-button
                            >
                        </div>
                    </el-header>
                    <el-table
                        ref="statusList"
                        :data="statusList"
                        border
                        tooltip-effect="dark"
                        style="width: 99%;"
                    >
                        <el-table-column
                            align="center"
                            prop="updatedAt"
                            label="操作时间"
                            :formatter="dateFormat"
                            min-width="15"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="content"
                            label="状态内容"
                            min-width="45"
                        ></el-table-column>
                        <el-table-column
                            min-width="10"
                            align="center"
                            label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    size="small"
                                    @click.prevent.native="
                                        deleteStatus(scope.row)
                                    "
                                    type="text"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer
                    style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                "
                >
                    <el-pagination
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="statusListCount"
                        background
                        :current-page.sync="statusPageIndex"
                        @current-change="val => handlePageIndexChange(val, 4)"
                        :page-size.sync="statusPageSize"
                        :page-sizes="[5, 10, 20]"
                        @size-change="val => handlePageSizeChange(val, 4)"
                    ></el-pagination>
                </el-footer>
            </el-container>
        </el-dialog>
        <el-dialog
            title="新增状态"
            :visible.sync="addStatusDialog"
            :append-to-body="true"
            :lock-scroll="true"
            :close-on-click-modal="false"
        >
            <el-form
                ref="statusForm"
                :model="statusForm"
                label-width="100px"
                :rules="statusFormRules"
            >
                <el-form-item label="内容" prop="content">
                    <el-input
                        size="small"
                        v-model="statusForm.content"
                        clearable
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button
                    size="small"
                    @click.prevent.native="addStatusDialog = false"
                    >取消</el-button
                >
                <el-button
                    size="small"
                    @click.prevent.native="addStatus"
                    type="primary"
                    >确认</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            searchForm: {
                type: null,
                tag: null,
                published: null
            },
            pageSize: 20,
            pageIndex: 1,
            articleListCount: 0,
            articleList: [],
            typeOptions: [
                { value: `code`, label: `编程` },
                { value: `game`, label: `游戏` },
                { value: `life`, label: `生活` }
            ],
            tagOptions: [
                { value: `html`, label: `HTML` },
                { value: `css`, label: `CSS` },
                { value: `js`, label: `JavaScript` },
                { value: `algo`, label: `算法` },
                { value: `vue`, label: `Vue.JS` },
                { value: `server`, label: `服务器` }
            ],
            publishOptions: [
                { value: 0, label: `未发布` },
                { value: 1, label: `已发布` }
            ],
            commentDialog: false,
            commentList: [],
            commentPageIndex: 1,
            commentPageSize: 10,
            commentListCount: 0,
            articleId: ``,
            eventTrackDialog: false,
            eventTrackList: [],
            eventTrackListCount: 0,
            eventTrackPageIndex: 1,
            eventTrackPageSize: 10,
            eventCodeList: {
                1000: `注册`,
                1001: `登陆`,
                1002: `更改密码`,
                2001: `获取文章列表`,
                2002: `删除文章`,
                2003: `更改文章状态`,
                2004: `新建文章`,
                2005: `编辑文章`,
                2006: `保存文章`,
                3001: `获取评论列表`,
                3002: `删除评论`,
                3003: `更改评论状态`,
                4001: `获取动态`,
                4002: `新增动态`,
                4003: `删除动态`,
                9999: `查看埋点日志`
            },
            statusDialog: false,
            statusList: [],
            statusListCount: 0,
            statusPageIndex: 1,
            statusPageSize: 5,
            statusForm: {
                content: null
            },
            statusFormRules: {
                content: [
                    { required: true, trigger: 'blur', message: `内容不能为空` }
                ]
            },
            addStatusDialog: false
        };
    },
    methods: {
        logout() {
            return this.$auth.logout();
        },
        getArticle() {
            this.loading = true;
            this.$axios
                .postFetch(this.$api.getArticleIndex, {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    published: this.searchForm.published,
                    tag: this.searchForm.tag,
                    type: this.searchForm.type
                })
                .then(res => {
                    this.articleList = res.data.resultList;
                    this.articleListCount = res.data.totalCount;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        newArticle() {
            this.loading = true;
            this.$axios
                .postFetch(this.$api.newArticle)
                .then(res => {
                    this.$router.push(
                        this.$router.push(`/draft/${res.data.articleId}`)
                    );
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changeArticleStatus(row) {
            this.loading = true;
            this.$axios
                .putFetch(this.$api.changeArticleStatus, {
                    articleId: row._id
                })
                .then(() => {
                    this.getArticle();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        pushToDraft(id) {
            this.$router.push(`draft/${id}`);
        },
        deleteArticle(row) {
            this.$confirm(`将删除文章: ${row.title}, 是否继续?`, `提示`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$axios
                    .deleteFetch(`${this.$api.deleteArticle}`, {
                        articleId: row._id
                    })
                    .then(() => {
                        this.getArticle();
                    });
            });
        },
        /* 评论模块 */
        getComment(articleId) {
            this.loading = true;
            this.articleId = articleId;
            this.$axios
                .postFetch(this.$api.getArticleComment, {
                    pageIndex: this.commentPageIndex,
                    pageSize: this.commentPageSize,
                    articleId
                })
                .then(res => {
                    this.commentList = res.data.resultList;
                    this.commentListCount = res.data.totalCount;
                    this.commentDialog = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changeCommentStatus(row) {
            this.loading = true;
            this.$axios
                .putFetch(this.$api.changeCommentStatus, {
                    commentId: row._id
                })
                .then(() => {
                    this.getComment(this.articleId);
                });
        },
        deleteComment(row) {
            this.$confirm(`删除这条评论，是否继续？`, `提示`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$axios
                    .deleteFetch(`${this.$api.deleteComment}`, {
                        commentId: row._id
                    })
                    .then(() => {
                        this.getComment(this.articleId);
                    });
            });
        },
        /* 埋点日志模块 */
        openEventTrackDialog() {
            this.getEventTrack();
            this.eventTrackDialog = true;
        },
        getEventTrack() {
            this.loading = true;
            this.$axios
                .postFetch(this.$api.getEventTrack, {
                    pageIndex: this.eventTrackPageIndex,
                    pageSize: this.eventTrackPageSize
                })
                .then(res => {
                    this.eventTrackListCount = res.data.totalCount;
                    this.eventTrackList = res.data.resultList;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        /* 最近状态模块 */
        openStatusDialog() {
            this.getStatus();
            this.statusDialog = true;
        },
        getStatus() {
            this.loading = true;
            this.$axios
                .postFetch(this.$api.getStatus, {
                    pageIndex: this.statusPageIndex,
                    pageSize: this.statusPageSize
                })
                .then(res => {
                    this.statusListCount = res.data.totalCount;
                    this.statusList = res.data.resultList;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        addStatus() {
            this.loading = true;
            this.$axios
                .putFetch(this.$api.addStatus, {
                    content: this.statusForm.content
                })
                .then(() => {
                    this.getStatus();
                })
                .finally(() => {
                    this.addStatusDialog = false;
                });
        },
        deleteStatus(row) {
            this.$confirm(`将删除状态: ${row.content}, 是否继续?`, `提示`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$axios
                    .deleteFetch(this.$api.deleteStatus, {
                        statusId: row._id
                    })
                    .then(() => {
                        this.getStatus();
                    });
            });
        },
        dateFormat(row, column) {
            return this.$dateFormat(
                new Date(row[column.property]),
                'yyyy-MM-dd hh:mm:ss'
            );
        },
        tableRowClassName({ row }) {
            if (row.published) {
                return 'on-row';
            }
            return 'off-row';
        },
        handlePageSizeChange(val, num) {
            switch (num) {
                case 1:
                    this.pageSize = val;
                    this.getArticle();
                    break;
                case 3:
                    this.eventTrackPageSize = val;
                    this.getEventTrack();
                    break;
                case 4:
                    this.statusPageSize = val;
                    this.getStatus();
                    break;
                default:
                    break;
            }
        },
        handlePageIndexChange(val, num) {
            switch (num) {
                case 1:
                    this.pageIndex = val;
                    this.getArticle();
                    break;
                case 2:
                    this.commentPageIndex = val;
                    this.getComment(this.articleId);
                    break;
                case 3:
                    this.eventTrackPageIndex = val;
                    this.getEventTrack();
                    break;
                case 4:
                    this.statusPageIndex = val;
                    this.getStatus();
                    break;
                default:
                    break;
            }
        },
        reset() {
            this.pageSize = 20;
            this.pageIndex = 1;
            this.$set(this, `searchForm`, {
                published: null,
                tag: null,
                type: null
            });
            this.getArticle();
        }
    },
    mounted() {
        this.getArticle();
    },
    watch: {
        commentDialog(newv) {
            if (newv === false) {
                this.commentPageIndex = 1;
            }
        },
        addStatusDialog(newv) {
            if (newv === false) {
                this.$set(this.statusForm, `content`, null);
            }
        }
    }
};
</script>

<style lang="scss">
.el-table__row.off-row {
    background: rgb(255, 252, 247) !important;
}
.el-table__row.on-row {
    background: #effce8;
}
</style>
