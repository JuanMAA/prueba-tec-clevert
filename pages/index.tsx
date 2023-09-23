import React, { useEffect, useState } from 'react';
import { Radio, Button, Tag, Modal, Divider, Col, Row, Popconfirm, Form, Input, message, Table, Typography } from 'antd';
import { format } from 'date-fns';
import { RadioChangeEvent } from '@/node_modules/antd/es/index';

interface DataType {
  gender?: string;
  name: {
    title?: string;
    first?: string;
    last?: string;
  };
  email?: string;
  picture: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  nat?: string;
  loading: boolean;
}


export default function Home() {
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState([] as Array<any>);
  const [placement, SetPlacement] = useState('all' as string);
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { Title } = Typography;

  useEffect(() => {
    getNotes()
  }, []);

  const getNotes = async () => {
    setInitLoading(true)
    try {
      const response = await fetch('/api/getNotes');
      if (!response.ok) {
        throw new Error('La solicitud no tuvo éxito');
      }
      const data = await response.json();
      setInitLoading(false)
      console.log("data", data)
      setList(data);
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error?.message ?? 'La solicitud no tuvo éxito',
      });
      setInitLoading(false)
    }
  };

  const saveNote = async (form: any) => {
    setInitLoading(true);
    fetch('/api/saveNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((_) => {
        messageApi.open({
          type: 'success',
          content: 'Tarea creada correctamente !!',
        });
        setInitLoading(false)
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error,
        });
        setInitLoading(false)
      });
    getNotes()
  };

  const changeStatus = async (id: any) => {
    setInitLoading(true);
    fetch('/api/changeStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((_) => {
        messageApi.open({
          type: 'success',
          content: 'Tarea actualizada correctamente !!',
        });
        getNotes()
        setInitLoading(false)
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error,
        });
        setInitLoading(false)
      });
  };

  const deleteNote = async (id: any) => {
    setInitLoading(true);
    fetch('/api/deleteNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((_) => {
        messageApi.open({
          type: 'success',
          content: 'Tarea eliminada correctamente !!',
        });
        getNotes()
        setInitLoading(false)
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error,
        });
        setInitLoading(false)
      });
  };

  const placementChange = (e: RadioChangeEvent) => {
    SetPlacement(e.target.value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function formatDateToCustomFormat(item: any) {
    const createdAt: any = item?.createdAt ? new Date(item.createdAt) : new Date();
    if (!isNaN(createdAt)) {
      return format(createdAt, 'yyyy-MM-dd HH:mm:ss');
    } else {
      return "Invalid Date";
    }
  }

  const columns: any = [
    {
      title: 'Tarea',
      width: 100,
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Estado',
      width: 100,
      dataIndex: 'finished',
      key: 'finished',
      render: (item: any) => item ? <Tag color="error">FINALIZADA</Tag> : <Tag color="success">ACTIVA</Tag>
    },
    {
      title: 'Detalle',
      width: 450,
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Fecha Creacion',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a: any, b: any) => {
        const dateA: any = new Date(a.createdAt);
        const dateB: any = new Date(b.createdAt);
        return dateA - dateB;
      },
      render: (item: any) => { return formatDateToCustomFormat(item?.createdAt) }
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (item: any) => {
        return <Row>
          <Col xs={24} xl={12} className="px-[1px]">
            <Popconfirm
              title="Cambiar estado de la Tarea"
              description={item?.finished ? "Estas seguro que deseas marcar como pendiente la tarea?" : "Estas seguro que deseas finalizar la tarea?"}
              okText="Si"
              cancelText="No"
              onConfirm={() => changeStatus(item?.id)}
            >
              {item?.finished ?
                <Button size="small" disabled={initLoading} loading={initLoading} block>Activar</Button>
                : <Button type="primary" size="small" disabled={initLoading} loading={initLoading} block>Finalizar</Button>}
            </Popconfirm>
          </Col>
          <Col xs={24} xl={12} className="px-[1px]">
            <Popconfirm
              title="Eliminar Tarea"
              description="Estas seguro que deseas eliminar la tarea?"
              okText="Si"
              cancelText="No"
              onConfirm={() => deleteNote(item?.id)}
            >
              <Button type="primary" size="small" disabled={initLoading} loading={initLoading} block danger>Eliminar</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
    },
  ];

  return (
    <div className='px-[15%] mt-[100px]' >
      <Row>
        <Col xs={24}>
          <Title level={2} className="text-center">Lista de Tareas</Title>
        </Col>
        <Col xs={24}>
          <Divider />
        </Col>
        <Col xs={24} md={24} xl={24} className="text-center vertical-align-center"  >
          <Row>
            <Col xs={24} md={12} xl={12}>
              <Radio.Group value={placement} onChange={placementChange} className="text-center flex justify-center my-[15px]">
                <Radio.Button disabled={initLoading} value="finished">Finalizadas</Radio.Button>
                <Radio.Button disabled={initLoading} value="actives">Activas</Radio.Button>
                <Radio.Button disabled={initLoading} value="all">Todas</Radio.Button>
              </Radio.Group>
            </Col>
            <Col xs={24} md={12} xl={12}>
              <Button className="my-[15px]" loading={initLoading} type="primary" size="middle" onClick={showModal}>
                Crear Tarea
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xl={24}>
          <Table loading={initLoading} columns={columns} dataSource={list.filter((item: any) => {
            return placement === 'all' ? item : placement === 'actives'
              ? item.finished == false : item.finished == true
          })} scroll={{ x: 1500, y: 300 }} />
        </Col>
        <Col>
          <Modal centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel} title="Crear Nota"
            footer={() => { return <></> }}>
            <Form
              form={form}
              size="middle"
              layout="vertical"
              onFinish={saveNote}
            >
              <Divider></Divider>
              <Form.Item name="content" rules={[
                {
                  required: true,
                  message: 'Por favor, ingresa el título de la nota'
                },
                {
                  min: 4,
                  max: 15,
                  message: 'El título debe tener entre 4 y 15 caracteres'
                }]
              }>
                <Input disabled={initLoading} placeholder="Titulo nota" />
              </Form.Item>
              <Form.Item name="title" rules={[
                {
                  required: true,
                  message: 'Por favor, ingresa el cuerpo de la nota'
                },
                {
                  min: 5,
                  max: 200,
                  message: 'El cuerpo debe tener entre 4 y 50 caracteres'
                }]
              }>
                <TextArea disabled={initLoading} rows={4} placeholder="Cuerpo nota" />
              </Form.Item>
              <Button loading={initLoading} type="primary" htmlType="submit">Guardar</Button>
            </Form>
          </Modal>
        </Col>
        <Col>
          {contextHolder}
        </Col>
      </Row>
    </div >
  )
}