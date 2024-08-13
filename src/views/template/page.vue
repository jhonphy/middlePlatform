/* eslint-disable */
<script lang="jsx">
  // @ts-nocheck
  import { defineComponent, ref, onBeforeMount, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { queryTemplate, queryApi } from '@/api/list';
  import { Modal } from '@arco-design/web-vue';

  export default defineComponent({
    setup() {
      const route = useRoute();
      const router = useRouter();
      const pageData = ref();
      const options = {};
      const form = ref({});
      const tableData = ref([]);
      const pagination = reactive({
        current: 1,
        pageSize: 10,
        total: 0
      });
      onBeforeMount(async () => {
        const { id } = route.params;
        const xmlData = await queryTemplate({ id });
        const pageNodeList = document.createElement('div');
        // ts
        pageNodeList.innerHTML = xmlData;
        pageData.value = pageNodeList;
        // eslint-disable-next-line no-console
        console.log('pageData', pageData);
      });
      const fetchOptionsData = (url, field) => {
        // eslint-disable-next-line no-undef
        queryApi(url).then((res) => {
          options[field] = res.data;
        });
        // 返回值格式{code: '',data:[{text: '', value； ’‘}], msg: ''}
      };
      const fetchSearch = (url) => {
        // 搜集form 参数
        if (pagination.current) {
          // 配置页码器 带页码参数
        }
        queryApi(url, form.value).then((res) => {
          tableData.value = res.data.data;
        });
      };
      const renderForm = (formNode) => {
        const { submit, btn = '查询', childNodes } = formNode;
        function renderOptions(list, nodes = []) {
          list.forEach(item => {
            const { desc, code } = item;
            const node = (
              <a-option v-model:value={code} v-model:label={desc} v-model:key={code} />
            );
            nodes.push(node);
          });
          return nodes;
        }
        function translateFormItemContent(item, node) {
          const { field, type, format, optionUrl } = item;
          options[field] = [];
          fetchOptionsData(optionUrl, field);
          switch (type) {
            case 'input':
              node = (
                <a-input
                  type="text"
                  v-model={form[field]}
                  allow-clear
                ></a-input>
              );
              break;
            case 'select':
              // eslint-disable-next-line no-case-declarations
              node = (
                <a-select
                  v-model={form[field]}
                  placeholder="请选择"
                  allow-clear
                >
                  {renderOptions(options[field])}
                </a-select>
              );
              break;
            case 'date':
              node = (
                <a-date-picker
                  v-model:value-format={format}
                  allow-clear
                ></a-date-picker>
              );
              break;
            case 'datetime':
              node = (
                <a-date-picker
                  v-model={form[field]}
                  v-model:value-format={format}
                  showtime
                  allow-clear
                ></a-date-picker>
              );
              break;
            default:
              node = (
                <a-input
                  type="text"
                  v-model={form[field]}
                  allow-clear
                ></a-input>
              );
          }
          return node;
        }
        function renderFormItem(formItems = [], nodes = []) {
          formItems.forEach((item) => {
            const { label, field } = item;
            const node = (
              <a-form-item label={label} field={field}>
                {translateFormItemContent(item)}
              </a-form-item>
            );
            nodes.push(node);
          });
          return nodes;
        }
        function renderCard(nodes = []) {
          childNodes.forEach((item) => {
            const { title } = item;
            const cardNode = (
              <a-card title={title}>{renderFormItem(item.childNodes)}</a-card>
            );
            nodes.push(cardNode);
          });
          return nodes;
        }
        // eslint-disable-next-line consistent-return
        function renderContent() {
          const name = childNodes[0].nodeName;
          if (name === 'CARD') {
            const cardNode = renderCard();
            return cardNode;
          }
          if (name === 'FORM_ITEM') {
            const formItemNode = renderFormItem(childNodes);
            return formItemNode;
          }
        }
        const node = (
          <a-form ref="ref_form" v-model:model={form} size="small">
            {renderContent()}
            <a-form-item>
              <a-button type="primary" onClick={() => {fetchSearch(submit)}}>
                {btn}
              </a-button>
            </a-form-item>
          </a-form>
        );
        return node;
      };
      /**
       * 渲染按钮
       */
      const renderButton = (nodeInfo) => {
        const { type, url, tempalteUrl, params, textContent } = nodeInfo;
        // eslint-disable-next-line consistent-return
        function tap() {
          switch (type) {
            case 'modal':
              Modal.info({
                title: '',
                content: '',
              });
              break;
            case 'link':
              // 跳转页面
              // 参数
              // eslint-disable-next-line no-case-declarations
              const keys = params.split(',');
              // eslint-disable-next-line no-case-declarations
              const p = {};
              keys.forEach(key => {
                if (key.includes('row_')) {
                  const k = key.slice(4);
                  p[key] = nodeInfo.row[k];
                }
              });
              router.push({
                path: tempalteUrl,
                params: { url, ...p },
              });
              break;
            case 'export':
              // 导出
              // eslint-disable-next-line no-restricted-globals
              location.href = url;
              break;
            default:
              // eslint-disable-next-line no-console
              console.log('');
          }
        }
        const fileChange = (files) => {
          const formData = new FormData();
          files.forEach((fileItem) => {
            formData.append('file', fileItem.file);
          });
          // TODO 上传
        };
        const node =
          type === 'import' ? (
            <a-upload
              v-model:auto-upload={false}
              onChange={(t) => {
                fileChange(t);
              }}
            >
              导入
            </a-upload>
          ) : (
            <a-button
              type="primary"
              size="small"
              onClick={() => {
                tap();
              }}
            >
              {textContent}
            </a-button>
          );
        return node;
      };
      /**
       * 渲染操作按钮部分
       * */
      const renderActionBtn = (buttons, nodes = []) => {
        const { childNodes } = buttons;
        childNodes.forEach((item) => {
          const node = renderButton(item);
          nodes.push(node);
        });
        return nodes;
      };
      const renderTable = (nodeInfo) => {
        const { dataUrl, expandUrl, showPagination, childNodes } = nodeInfo;
        const columns = [];
        childNodes.forEach(columnItem => {
          // eslint-disable-next-line no-shadow
          const { type = 'text', field, title, childNodes } = columnItem;
          if (type === 'text') {
            columns.push({
              title,
              dataIndex: field,
            })
          } else if (type === 'file') {
            columns.push({
              title: '操作',
              dataIndex: field,
              render: ({ record }) => {
                function renderFileName(list, nodes = []) {
                  list.forEach((l) => {
                    const node = (
                      <a-button
                        onClick={() => {
                          // eslint-disable-next-line no-restricted-globals
                          location.href = l.url;
                        }}
                      >
                        {l.fileName}
                      </a-button>
                    );
                    nodes.push(node);
                  });
                  return nodes;
                }
                return (
                  <a-space>
                    {renderFileName(record[field])}
                  </a-space>
                )
              },
            });
          } else if (type === 'view_option') {
            columns.push({
              title,
              dataIndex: field,
              render: ({record}) => {
                // eslint-disable-next-line no-shadow
                function renderOptions(childNodes, nodes = []) {
                  childNodes.forEach((item) => {
                    item.row = record;
                    const node = renderButton(item);
                    nodes.push(node);
                  });
                  return nodes;
                }
                return (
                  <a-space>
                    {renderOptions(childNodes)}
                  </a-space>
                )
              },
            });
          }
        });
        const node = (
          <a-table
            v-model:data={tableData}
            v-model:pagination={showPagination ? pagination : false}
          ></a-table>
        )
      };
      /**
       * 渲染tabs
       * */
      const renderTabs = (tabs = [], tabNodes = []) => {
        tabs.forEach((item, index) => {
          const { title } = item; // a-tab-pane 的title
          const node = (
            <a-tab-pane title={title} key={`ms-tab-pane-${index}`}></a-tab-pane>
          );
          tabNodes.push(node);
        });
        return tabNodes;
      };
      // 渲染tab内节点页面
      const renderPageNode = (nodeData = {}, nodes = []) => {
        /**
         * title tab页签标题
         * type 页面类型 list页表页面 detail详情页面
         * url 详情请求数据的API地址
         * */
        const { title, type, url, childNodes } = nodeData;
        childNodes.forEach((item) => {
          const name = item.nodeName;
          if (name === 'FORM') {
            const res = renderForm(item);
            nodes.push(res);
          } else if (name === 'ACTION') {
            const res = renderActionBtn(item);
            nodes.push(res);
          } else if (name === 'TABLE') {
            const res = renderTable(item);
            nodes.push(res);
          }
        });
        return nodes;
      };
      // eslint-disable-next-line consistent-return
      const renderPage = () => {
        if (pageData.value) {
          const tabs = pageData.value.childNodes[0].childNodes ?? [];
          const len = tabs.length;
          if (len > 1) {
            return (
              <a-tabs default-active-key="ms-tab-pane-0">
                {renderTabs(tabs)}
              </a-tabs>
            );
          }
          if (len === 1) {
            return renderPageNode(tabs[0]);
          }
          if (len === 0) {
            return '';
          }
        }
      };
      return () => <div class="container">{renderPage()}</div>;
    },
  });
</script>
