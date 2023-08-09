import { useMutation } from '@apollo/client';
import type { RadioChangeEvent } from 'antd';
import { Button, Checkbox, message, Modal, Radio } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdateClassification } from '@/apis';
import { getUserType } from '@/store/SaveToken';

import styles from './style.module.less';

interface Props {
  CombinationData: CombinationType;
  update?: boolean;
  pesonal_id?: number;
}

export type CombinationType = {
  level: string;
  reason: string;
  ispetition?: Boolean;
  petition: null | string;
};

const options = [
  {
    label: 'A',
    value: 'A',
  },
  {
    label: 'B',
    value: 'B',
  },
  {
    label: 'C',
    value: 'C',
  },
  {
    label: 'D',
    value: 'D',
  },
];

const Combination: React.FC<Props> = ({ CombinationData, update, pesonal_id }) => {
  const [open, setOpen] = useState(false);
  const [police, setPolice] = useState(false);
  // const [changesShow, setChangesShow] = useState<any[]>([]);
  const [plainOptions, setPlainOptions] = useState<string[]>([]);
  const [classabcd, setClassabcd] = useState('未分类'); // 人员ABCD分类
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(['未选择']);

  const navigate = useNavigate();

  const [updateClassification] = useMutation(UpdateClassification);

  useEffect(() => {
    const role = getUserType();
    if (role === 'filmPolice' || role === 'Director') {
      setPolice(true);
    }
  }, []);

  const handleCancel = () => {
    setOpen(false);
    // setChangedata([]);
  };

  const checkonChange = (e: RadioChangeEvent) => {
    // console.log('checked = ', e.target.value);
    let newPlainOptions: string[] | ((prevState: never[]) => never[]) = [];

    switch (e.target.value) {
      case 'A':
        setClassabcd('A');
        newPlainOptions = [
          '涉政、恐、毒、重大刑事犯罪前科人员',
          '肇事肇祸精神病人',
          '潜在社会危害性人员',
          '其他重点人员',
        ];
        break;
      case 'B':
        setClassabcd('B');
        newPlainOptions = [
          '一般违法和其他刑满释放人员',
          '社区矫正、取保候审监视居住、境外居留人员',
          '旅游人员',
          '涉枪涉爆涉危化、现实表现差等重点人员',
          '其他重点人员',
        ];
        break;
      case 'C':
        setClassabcd('C');
        newPlainOptions = [
          '其他流动人口',
          '涉访人员和独居老人',
          '生活困难等无人监管的鳏寡孤独残障病幼等特殊人员',
          '其他特殊人员',
        ];
        break;
      default:
        setClassabcd('D');
        newPlainOptions = [];
    }

    setPlainOptions(newPlainOptions);
  };

  const onsubChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
  };

  const handleSubmit = () => {
    let reason: string;
    const checkedList_string = checkedList.join(' ');

    checkedList.map((item) => {
      reason = item + reason;
    });
    updateClassification({
      variables: {
        personalId: pesonal_id,
        classification_reason: checkedList_string,
        person_classification: classabcd,
      },
      refetchQueries: ['getPeopleData'],
    })
      .then(() => message.success('修改成功'))
      .catch(() => message.error('修改失败'));
    navigate('/population-manager/person-show');
  };

  return (
    <>
      {update && police ? (
        <Button
          type="primary"
          style={{
            marginBottom: '1vh',
            backgroundColor: '#0559ca',
            borderRadius: '5px',
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          修改人员分级类别
        </Button>
      ) : (
        <></>
      )}
      <div className={styles.CombinationBox}>
        <table>
          <tbody>
            <tr>
              <td>人员分级类别</td>
              <td>{CombinationData?.level}</td>
            </tr>
            <tr>
              <td>分类依据</td>
              <td>{CombinationData?.reason}</td>
            </tr>
            <tr>
              <td>上访诉求</td>
              <td>{CombinationData?.petition}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal
        title="人员分级类别"
        open={open}
        width={910}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Radio.Group
          style={{ marginTop: 10, marginBottom: 10 }}
          options={options}
          value={classabcd}
          onChange={checkonChange}
        />
        <Checkbox.Group
          options={plainOptions}
          value={checkedList}
          onChange={onsubChange}
        />
      </Modal>
    </>
  );
};

export default Combination;
