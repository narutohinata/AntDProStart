import ProForm, {
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';

const options = [
  {
    label: '中国AppStore',
    value: 'cn_appstore',
  },
  {
    label: '中国TapTap',
    value: 'cn_taptao',
  },
  {
    label: '港台AppStore',
    value: 'appstore',
  },
  {
    label: '港台GoolePlay',
    value: 'goole_play',
  },
];

const Admin: React.FC = () => {
  // const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState<bool>(true);
  const [checkAll, setCheckAll] = useState<bool>(true);
  console.log(checkAll);
  const formRef = useRef<
    ProFormInstance<{
      channels: string[];
    }>
  >();
  const handleClickAllChannel = (e: React.EventHandler) => {
    setIndeterminate(false);
    setCheckAll(e.target.value);
    formRef.current?.setFieldsValue({
      channels: e.target.checked ? options.map((option) => option.value) : [],
    });
  };
  const intl = useIntl();
  return (
    <PageHeaderWrapper
      content={intl.formatMessage({
        id: 'pages.admin.subPage.title',
        defaultMessage: 'This page can only be viewed by admin',
      })}
    >
      <Card>
        <ProForm
          onFinish={async (values) => {
            console.log(values);
            message.success('提交成功');
          }}
          formRef={formRef}
          grid
          initialValues={{}}
          submitter={{
            render: () => {
              return (
                <div>
                  <Space size={25}>
                    <Button
                      type="primary"
                      onClick={() => {
                        formRef.current.submit();
                      }}
                    >
                      发布
                    </Button>
                    <Button type="dashed">草稿</Button>
                    <Button type="danger">删除</Button>
                  </Space>
                </div>
              );
            },
          }}
        >
          <ProForm.Group>
            <ProFormText
              label="公告Key"
              colProps={{
                md: 8,
              }}
              addonAfter={<Button type="primary">随机生成</Button>}
              initialValue="prop"
              required
            />
          </ProForm.Group>

          <ProForm.Group>
            <ProFormText
              colProps={{
                md: 8,
              }}
              label="公告名称"
              initialValue="name"
              required
            />
          </ProForm.Group>

          <ProForm.Group>
            <ProFormDigit
              colProps={{
                md: 8,
              }}
              label="显示优先级"
              initialValue="prority"
              required
            />
          </ProForm.Group>

          <ProForm.Group
            style={{
              border: '1px dashed rgb(24, 144, 255, .5)',
              padding: '10px',
              marginBottom: '10px',
            }}
            title="内容配置"
          >
            <ProForm.Group>
              <ProFormSelect
                name="annoType"
                label="公告类型"
                colProps={{
                  md: 8,
                }}
                request={async () => [
                  { label: '全部', value: 'all' },
                  { label: '未解决', value: 'open' },
                  { label: '已解决', value: 'closed' },
                  { label: '解决中', value: 'processing' },
                ]}
                placeholder="Please select a country"
                rules={[{ required: true, message: 'Please select your country!' }]}
              />
            </ProForm.Group>
            <ProFormDependency name={['annoType']}>
              {({ annoType }) => {
                switch (annoType) {
                  case 'open':
                    return (
                      <ProForm.Group title="奖励设置">
                        <ProFormSelect
                          label="奖励"
                          colProps={{
                            md: 8,
                          }}
                          rules={[
                            {
                              required: true,
                              message: 'Please 选择一个奖励',
                            },
                          ]}
                          name="open$A"
                          options={[
                            {
                              value: 'A',
                              label: 'A',
                            },
                          ]}
                        />
                      </ProForm.Group>
                    );

                  default:
                    return null;
                }
              }}
            </ProFormDependency>
          </ProForm.Group>

          <ProForm.Group>
            <ProFormCheckbox.Group
              addonBefore={
                // <ProFormDependency name={['channels']}>
                //   {({ channels }) => {
                //     setIndeterminate(!!channels.length && channels.length < options.length);
                //     setCheckAll(channels.length === options.length);
                //     return (

                //     );
                //   }}
                // </ProFormDependency>
                <Checkbox
                  name="checkAll"
                  indeterminate={indeterminate}
                  onChange={handleClickAllChannel}
                >
                  全选
                </Checkbox>
              }
              name="channels"
              label="发布渠道"
              required
              options={options}
            />
          </ProForm.Group>

          <ProForm.Group
            colProps={{
              md: 24,
            }}
          >
            <ProFormTextArea
              name="text"
              label="名称"
              placeholder="请输入名称"
              colProps={{
                span: 24,
              }}
            />
          </ProForm.Group>
        </ProForm>

        <ProForm
          onFinish={async (values) => {
            console.log(values);
            message.success('提交成功');
          }}
          syncToUrl={(values, type) => {
            console.log('values', values);
            if (type === 'get') {
              // 为了配合 transform
              // startTime 和 endTime 拼成 createTimeRanger
              return {
                ...values,
                createTimeRanger:
                  values.startTime || values.endTime
                    ? [values.startTime, values.endTime]
                    : undefined,
              };
            }
            // expirationTime 不同步到 url
            return {
              ...values,
              expirationTime: undefined,
            };
          }}
          initialValues={{
            name: '蚂蚁设计有限公司',
            useMode: 'chapter',
          }}
          autoFocusFirstInput
        >
          <ProFormSelect
            options={[
              {
                value: 'chapter',
                label: '盖章后生效',
              },
            ]}
            width="sm"
            name="useMode"
            label="合同约定生效方式"
          />
          <ProFormDateRangePicker
            transform={(values) => {
              return {
                startTime: {
                  value: values ? values[0] : undefined,
                  op: '>=',
                  key: 'startTime',
                },
                endTime: values ? values[1] : undefined,
              };
            }}
            width="md"
            name="createTimeRanger"
            label="合同生效时间"
          />
          <ProFormDatePicker width="md" name="expirationTime" label="合同失效时间" />
        </ProForm>
      </Card>

      <p style={{ textAlign: 'center', marginTop: 24 }}>
        Want to add more pages? Please refer to{' '}
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
        。
      </p>
    </PageHeaderWrapper>
  );
};

export default Admin;
