<template>
    <div
        style="height: 100%; width: 100%;"
        v-loading.fullscreen.lock="fullScreenLoading"
        id="draft"
    >
        <el-container>
            <el-main>
                <el-page-header @back="goBack" title="返回管理">
                </el-page-header>
                <div class="title">文章编辑</div>
                <el-row class="row">
                    <el-col :span="6">
                        <el-input
                            size="small"
                            placeholder="文章标题"
                            v-model="title"
                        ></el-input>
                    </el-col>
                </el-row>
                <el-row class="row">
                    <el-col :span="12">
                        <el-select
                            size="small"
                            v-model="type"
                            placeholder="类型"
                        >
                            <el-option
                                v-for="(item, index) in typeOptions"
                                :key="`type` + index"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class="row">
                    <el-col :span="12">
                        <el-select size="small" v-model="tag" placeholder="标签"
                            ><el-option
                                v-for="(item, index) in tagOptions"
                                :key="`tag` + index"
                                :value="item.value"
                                :label="item.label"
                            ></el-option
                        ></el-select>
                    </el-col>
                </el-row>
                <div class="editor">
                    <quill-editor
                        v-model="content"
                        :options="editorOption"
                    ></quill-editor>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
// import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { quillEditor } from 'vue-quill-editor';
export default {
    data() {
        return {
            fullScreenLoading: false,
            title: null,
            type: null,
            tag: null,
            articleId: null,
            content: null,
            // 分类
            typeOptions: [
                { value: `code`, label: `编程` },
                { value: `game`, label: `游戏` },
                { value: `life`, label: `生活` }
            ],
            // 标签
            tagOptions: [
                { value: `html`, label: `HTML` },
                { value: `css`, label: `CSS` },
                { value: `js`, label: `JavaScript` },
                { value: `algo`, label: `算法` },
                { value: `vue`, label: `Vue.JS` },
                { value: `server`, label: `服务器` }
            ],
            // 富文本
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block']
                    ]
                },
                theme: 'snow'
            }
        };
    },
    methods: {
        initDraft() {
            this.fullScreenLoading = true;
            const articleId = this.$route.params.articleId;
            this.$axios
                .getFetch(this.$api.getDraft, { articleId: articleId })
                .then(res => {
                    this.title = res.data.article.title;
                    this.type = res.data.article.type;
                    this.tag = res.data.article.tag;
                    this.articleId = res.data.article._id;
                    this.content = res.data.article.content;
                })
                .finally(() => {
                    this.fullScreenLoading = false;
                });
        },
        saveDraft() {
            this.fullScreenLoading = true;
            this.$axios
                .putFetch(this.$api.saveDraft, {
                    articleId: this.articleId,
                    title: this.title,
                    type: this.type,
                    tag: this.tag,
                    content: this.content
                })
                .finally(() => {
                    this.fullScreenLoading = false;
                });
        },
        goBack() {
            this.saveDraft();
            this.$router.go(-1);
        },
        init() {
            this.initDraft();
        }
    },
    mounted() {
        this.init();
    },
    components: {
        quillEditor
    }
};
</script>

<style lang="scss" scoped>
.row {
    margin: 0.4rem 0;
}

#draft {
    padding: 100px 0 0 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
        font-size: 24px;
        padding: 10px 0;
    }
    .editor {
        background: white;
        width: 90%;
    }
}
</style>
