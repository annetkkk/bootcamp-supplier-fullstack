import React, {useEffect, useState} from 'react';
import {ColumnProps, RecordDataSource, Table} from '@v-uik/table';
import {createUseStyles} from 'react-jss';
import {Button} from '@v-uik/button';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@v-uik/modal';
import {Input} from '@v-uik/input';
import {ReactComponent as Plus} from './assets/plus.svg';
import {notification} from '@v-uik/notification';

type DarkstoreSource = RecordDataSource<{
  id: number;
  address: string;
}>;

const useStyles = createUseStyles({
  main: {
    backgroundColor: '#fff',
    margin: [112, 16, 0, 16],
    borderRadius: 5,
    padding: 32,
  },
  buttonWrapper: {
    display: 'flex',
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
});

export function Darkstore(): JSX.Element {
  const classesList = useStyles();

  const [selectedId, setSelectedId] = useState(0);
  const [selectedDarkstoreName, setSelectedDarkstoreName] = useState('');

  const [openCreation, setOpenCreation] = useState(false);
  const showModalCreation = () => setOpenCreation(true);
  const hideModalCreation = () => setOpenCreation(false);

  const [openDelete, setOpenDelete] = useState(false);
  const showModalDelete = () => setOpenDelete(true);
  const hideModalDelete = () => setOpenDelete(false);

  const [openEdit, setOpenEdit] = useState(false);
  const showModalEdit = () => setOpenEdit(true);
  const hideModalEdit = () => setOpenEdit(false);

  const [darkstore, setDarkstores] = useState<DarkstoreSource[]>([]);

  async function loadData() {
    await fetch('http://localhost:8080/darkstore')
      .then((response) => response.json())
      .then((response) => setDarkstores(response));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveNewDarkstore() {
    const response = await fetch('http://localhost:8080/darkstore', {
      method: 'POST',
      body: JSON.stringify({
        address: selectedDarkstoreName !== '' ? selectedDarkstoreName : null,
      }),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const message = await response.text();
      notification.error(message);
      return;
    }

    hideModalCreation();
    await loadData();
  }

  async function deleteDarkstore() {
    const response = await fetch(
      'http://localhost:8080/darkstore/${selectedId}',
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const message = await response.text();
      notification.error(message);
      return;
    }

    hideModalDelete();
    await loadData();
  }

  async function updateDarkstore() {
    const response = await fetch(
      'http://localhost:8080/darkstore/${selectedId}',
      {
        method: 'PUT',
        body: JSON.stringify({
          id: selectedId,
          address: selectedDarkstoreName !== '' ? selectedDarkstoreName : null,
        }),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      const message = await response.text();
      notification.error(message);
      return;
    }

    hideModalEdit();
    await loadData();
  }

  const columns: ColumnProps<DarkstoreSource>[] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: '№',
    },
    {
      key: 'address',
      dataIndex: 'address',
      title: 'Адрес склада',
    },
    {
      key: 'edit',
      dataIndex: 'edit',
      renderCellContent: (thiscell) => (
        <Button
          aria-label="Действие"
          onClick={() => {
            setSelectedId(thiscell.row.id);
            setSelectedDarkstoreName(thiscell.row.address);
            showModalEdit();
          }}
        >
          Изменить
        </Button>
      ),
    },
    {
      key: 'delete',
      dataIndex: 'delete',
      renderCellContent: (thiscell) => (
        <Button
          aria-label="Действие"
          onClick={() => {
            setSelectedId(thiscell.row.id);
            setSelectedDarkstoreName(thiscell.row.address);
            showModalDelete();
                      }}
                      style={{
                        backgroundColor: 'red',
                      }}
                    >
                      Удалить
                    </Button>
                  ),
                },
              ];

              return (
                <>
                  <div className={classesList.main}>
                    <div className={classesList.buttonWrapper}>
                      <Button
                        kind="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedDarkstoreName('');
                          showModalCreation();
                        }}
                      >
                        <Plus style={{marginRight: 8}} />
                        Создать
                      </Button>
                    </div>

                    <Table columns={columns} dataSource={darkstore} />

                    <Modal open={openCreation} onClose={hideModalCreation}>
                      <ModalHeader
                        closeButtonProps={{
                          'aria-label': 'Close modal',
                        }}
                      >
                        Добавить новый склад
                      </ModalHeader>

                      <ModalBody>
                        <Input
                          label="Адрес склада"
                          value={selectedDarkstoreName}
                          onChange={setSelectedDarkstoreName}
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button kind="outlined" onClick={hideModalCreation}>
                          Отмена
                        </Button>

                        <Button onClick={saveNewDarkstore}>Применить</Button>
                      </ModalFooter>
                    </Modal>

                    <Modal open={openDelete} onClose={hideModalDelete}>
                      <ModalHeader
                        closeButtonProps={{
                          'aria-label': 'Close modal',
                        }}
                      >
                        Удалить склад
                      </ModalHeader>

                      <ModalBody>
                        Вы действительно хотите удалить адрес склада <br />
                        <b>{selectedDarkstoreName}</b>?
                      </ModalBody>

                      <ModalFooter>
                        <Button kind="outlined" onClick={hideModalDelete}>
                          Отмена
                        </Button>

                        <Button onClick={deleteDarkstore}>Применить</Button>
                      </ModalFooter>
                    </Modal>

                    <Modal open={openEdit} onClose={hideModalEdit}>
                      <ModalHeader
                        closeButtonProps={{
                          'aria-label': 'Close modal',
                        }}
                      >
                        Изменить адрес склада
                      </ModalHeader>

                      <ModalBody>
                        <Input
                          label="Адрес склада"
                          value={selectedDarkstoreName}
                          onChange={setSelectedDarkstoreName}
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button kind="outlined" onClick={hideModalEdit}>
                          Отмена
                        </Button>

                        <Button onClick={updateDarkstore}>Применить</Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                </>
              );
            }

            export default Darkstore;
