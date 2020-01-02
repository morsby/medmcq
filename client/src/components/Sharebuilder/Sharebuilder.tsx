import React, { useState, useEffect, useCallback } from 'react';
import { Segment, Dropdown, Divider } from 'semantic-ui-react';
import { Table, Icon, Button } from 'antd';
import Highlighter from 'react-highlighter';
import ExtendedRow from 'components/Sharebuilder/extendedRow';
import { useSelector, useDispatch } from 'react-redux';
import SearchDropdown from 'components/Sharebuilder/searchDropdown';
import { useHistory } from 'react-router';
import _ from 'lodash';
import { ReduxState } from 'redux/reducers';
import shareBuilderReducer from 'redux/reducers/sharebuilder';
import ShareBuilderClass from 'classes/ShareBuilder';
import Question, { QuestionFilterInput } from 'classes/Question';

export interface SharebuilderProps {}

const Sharebuilder: React.SFC<SharebuilderProps> = () => {
  const history = useHistory();
  const [link, setLink] = useState('');
  const [filter, setFilter] = useState<Partial<QuestionFilterInput>>({});
  // Redux
  const dispatch = useDispatch();
  const picked = useSelector((state: ReduxState) => state.shareBuilder.picked);
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const chosenSemesterId = useSelector((state: ReduxState) => state.selection.semesterId);
  const { tags, specialties } = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === chosenSemesterId)
  );
  const pickedQuestions = useSelector((state: ReduxState) => state.questions.questions);
  const [selectedId, setSelectedId] = useState<null | number>(null);

  // Debounce filter, for ikke at query på hvert keystroke (delay er 1 sekund, som angivet herunder)
  const debounceQueryFilter = useCallback(
    _.debounce((filter: Partial<QuestionFilterInput>) => Question.fetch(filter), 1000),
    []
  );

  // UseEffect til at skifte query filteret, men kun hvis man faktisk har valgt filtre
  // Er en lidt "omstændig" måde at undgå at useQuery bliver kaldt uden parameters,
  // da det henter alle spørgsmål. Bedre implementering søges.. ;)
  useEffect(() => {
    if (selectedId) {
      debounceQueryFilter({ ids: [selectedId] });
    }
    if (filter.text || filter.tagIds.length > 0 || filter.specialtyIds.length > 0) {
      debounceQueryFilter(filter);
    }
  }, [debounceQueryFilter, filter]);

  const handleChange = (value: string, type: keyof QuestionFilterInput) => {
    setFilter((prevFilter) => ({ ...prevFilter, [type]: value }));
  };

  // Kalder redux når man har valgt et spørgsmål, og lægger det her (under shareBuilder reducer -> picked)
  const handlePick = (value) => {
    const index = _.indexOf(picked, value);

    if (index !== -1)
      return dispatch(
        shareBuilderReducer.actions.setPicked([
          ...picked.slice(0, index),
          ...picked.slice(index + 1)
        ])
      );

    const newPick = picked.concat(value);

    dispatch(shareBuilderReducer.actions.setPicked(newPick));
  };

  // Function til at skabe linket, når man har bygget færdigt - kalder useMutation
  const handleCreateLink = async () => {
    const link = await ShareBuilderClass.createShareLink({ questionIds: picked });
    setLink(link);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      filterIcon: <Icon type="search" style={{ color: selectedId ? '#1890ff' : undefined }} />,
      filterDropdown: (
        <SearchDropdown
          onChange={(value) => setSelectedId(value)}
          value={String(selectedId)}
          type="search"
        />
      )
    },
    {
      title: 'Spørgsmål',
      dataIndex: 'text',
      key: 'text',
      filterDropdown: (
        <SearchDropdown
          onChange={(value) => handleChange(value, 'text')}
          value={filter.text}
          type="search"
        />
      ),
      filterIcon: <Icon type="search" style={{ color: filter.text ? '#1890ff' : undefined }} />,
      render: (text) => (
        <Highlighter
          matchStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          search={filter.text}
          matchElement="span"
        >
          {text}
        </Highlighter>
      )
    },
    {
      title: 'Specialer',
      dataIndex: 'specialties',
      key: 'specialties',
      filterDropdown: (
        <SearchDropdown
          onChange={(value) => handleChange(value, 'semesterId')}
          options={_(specialties)
            .filter((s) => s.semester.id === filter.semesterId)
            .map((s) => ({
              key: s.id,
              value: s.id,
              text: s.name
            }))
            .value()}
          value={filter.specialtyIds.map((specialtyId) => String(specialtyId))}
          type="dropdown"
        />
      ),
      filterIcon: (
        <Icon
          type="search"
          style={{ color: filter.specialtyIds.length > 0 ? '#1890ff' : undefined }}
        />
      ),
      render: (record) => <p>{_.map(record, (s) => specialties[s.specialtyId].name).join(', ')}</p>
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      filterDropdown: (
        <SearchDropdown
          options={_(tags)
            .filter((t) => t.semester.id === filter.semesterId && t.name !== 'Tags')
            .map((t) => ({
              key: t.id,
              text: t.name,
              value: t.id
            }))
            .value()}
          onChange={(value) => handleChange(value, 'tagIds')}
          value={filter.tagIds.map((tag) => String(tag))}
          type="dropdown"
        />
      ),
      filterIcon: (
        <Icon type="search" style={{ color: filter.tagIds.length > 0 ? '#1890ff' : undefined }} />
      ),
      render: (record) => (
        <p>
          {_(record)
            .map((t) => tags[t.tagId].name)
            .filter((t) => t !== 'Tags')
            .value()
            .join(', ')}
        </p>
      )
    },
    {
      title: '',
      key: 'actions',
      render: (record) => (
        <>
          <Button
            type={_.indexOf(picked, record.id) !== -1 ? 'danger' : 'primary'}
            onClick={() => handlePick(record.id)}
          >
            {_.indexOf(picked, record.id) !== -1 ? <Icon type="cross" /> : 'Tilføj'}
          </Button>
          <Button onClick={() => history.push('/quiz/' + record.id)}>Gå til spørgsmål</Button>
        </>
      )
    }
  ];

  return (
    <div className="flex-container">
      <Segment
        className="content"
        style={{ margin: '5rem auto', maxWidth: '1300px' }}
        textAlign="center"
      >
        <h1>Opret Quiz</h1>
        <label>Valg</label>
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={pickedQuestions || null}
            expandedRowRender={(record) => <ExtendedRow record={record} />}
          />
        </div>
        <Divider hidden />
        <Button type="primary" disabled={picked.length < 1} onClick={handleCreateLink}>
          Opret link
        </Button>
        {link && (
          <div style={{ border: '2px solid grey', padding: '1rem', margin: '1rem' }}>
            <h3>
              Dette er dit link:{' '}
              <a target="_blank" rel="noopener noreferrer" href={window.location.href + '/' + link}>
                {window.location.href + '/' + link}
              </a>
            </h3>
            <p>Linket åbner i et nyt vindue. Husk at gemme det hvis du skal bruge det igen.</p>
          </div>
        )}
        <Divider />
        <label>Semester</label>
        <Dropdown
          options={_.map(semesters, (semester) => ({
            value: semester.id,
            text: `${semester.value}. semester (${semester.name})`,
            key: semester.id
          }))}
          value={filter.semesterId}
          onChange={(e, { value }: { value: number }) =>
            setFilter((prevFilter) => ({ ...prevFilter, semester: value }))
          }
          fluid
          selection
        ></Dropdown>
        <Divider />
        <div style={{ overflowX: 'auto' }}>
          <Table
            rowKey={(record: any) => record.id}
            dataSource={pickedQuestions}
            columns={columns}
            expandedRowRender={(record) => <ExtendedRow record={record} />}
          ></Table>
        </div>
      </Segment>
    </div>
  );
};

export default Sharebuilder;
