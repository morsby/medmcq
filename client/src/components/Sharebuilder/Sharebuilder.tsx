import React, { useState, useEffect, useCallback } from 'react';
import { Segment, Dropdown, Divider } from 'semantic-ui-react';
import { Table, Icon, Button, Tag } from 'antd';
import Highlighter from 'react-highlighter';
import ExtendedRow from 'components/Sharebuilder/ExtendedRow';
import { useSelector, useDispatch } from 'react-redux';
import SearchDropdown from 'components/Sharebuilder/SearchDropdown';
import { useHistory } from 'react-router';
import _ from 'lodash';
import { ReduxState } from 'redux/reducers';
import shareBuilderReducer from 'redux/reducers/sharebuilder';
import ShareBuilderClass from 'classes/ShareBuilder';
import Question from 'classes/Question';
import { QuestionFilterInput } from 'types/generated';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import Semester from 'classes/Semester';
import Selection from 'classes/Selection';

export interface SharebuilderProps {}

const Sharebuilder: React.SFC<SharebuilderProps> = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [link, setLink] = useState('');
  const [filter, setFilter] = useState<Partial<QuestionFilterInput>>({
    specialtyIds: [],
    tagIds: []
  });
  // Redux
  const user = useSelector((state: ReduxState) => state.auth.user);
  const picked = useSelector((state: ReduxState) => state.shareBuilder.picked);
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  let questions = useSelector((state: ReduxState) => state.questions.questions);
  const semesterId = useSelector((state: ReduxState) => state.selection.semesterId);
  const semester = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === semesterId)
  );
  const tags = semester?.tags;
  const specialties = semester?.specialties;
  const pickedQuestions = useSelector((state: ReduxState) => state.shareBuilder.picked);
  const [selectedId, setSelectedId] = useState<null | number>(null);
  const shouldNotFetch =
    !semesterId || (!filter.text && filter.tagIds.length === 0 && filter.specialtyIds.length === 0);

  // Debounce filter, for ikke at query på hvert keystroke (delay er 1 sekund, som angivet herunder)
  const debounceQueryFilter = useCallback(
    _.debounce(async (filter: Partial<QuestionFilterInput>) => {
      setFilterLoading(true);
      await Question.fetch({ ...filter, semesterId });
      setFilterLoading(false);
    }, 1000),
    [semesterId]
  );

  // UseEffect til at skifte query filteret, men kun hvis man faktisk har valgt filtre
  // Er en lidt "omstændig" måde at undgå at useQuery bliver kaldt uden parameters,
  // da det henter alle spørgsmål. Bedre implementering søges.. ;)
  useEffect(() => {
    if (selectedId) {
      debounceQueryFilter({ ids: [selectedId] });
    }
    if (!shouldNotFetch) {
      debounceQueryFilter(filter);
    }
  }, [debounceQueryFilter, filter]);

  const handleChange = (value: any, type: keyof QuestionFilterInput) => {
    setFilter({ ...filter, [type]: value });
  };

  useEffect(() => {
    const fetchInitial = async () => {
      if (!semester) {
        await Semester.fetchAll();
      }
      setInitialLoading(false);
    };

    fetchInitial();
  }, []);

  // Kalder redux når man har valgt et spørgsmål, og lægger det her (under shareBuilder reducer -> picked)
  const handlePick = (value: Question) => {
    dispatch(shareBuilderReducer.actions.addPicked(value));
  };

  // Function til at skabe linket, når man har bygget færdigt - kalder useMutation
  const handleCreateLink = async () => {
    setSubmitLoading(true);
    const link = await ShareBuilderClass.createShareLink({ questionIds: picked.map((q) => q.id) });
    setLink(link);
    setSubmitLoading(false);
  };

  console.log(filter);
  if (!semester) return <LoadingPage />;
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
      key: 'specialties',
      filterDropdown: (
        <SearchDropdown
          onChange={(value) => handleChange(value, 'specialtyIds')}
          options={specialties.map((s) => ({
            key: s.id,
            value: s.id,
            text: s.name
          }))}
          value={filter.specialtyIds?.map((specialtyId) => String(specialtyId))}
          type="dropdown"
        />
      ),
      filterIcon: (
        <Icon
          type="search"
          style={{ color: filter.specialtyIds.length > 0 ? '#1890ff' : undefined }}
        />
      ),
      render: (record: Question) =>
        record.specialties.map((s) => (
          <Tag color="blue">{specialties.find((specialty) => s.id === specialty.id)?.name}</Tag>
        ))
    },
    {
      title: 'Tags',
      key: 'tags',
      filterDropdown: (
        <SearchDropdown
          options={tags.map((t) => ({
            key: t.id,
            text: t.name,
            value: t.id
          }))}
          onChange={(value) => handleChange(value, 'tagIds')}
          value={filter.tagIds.map((tag) => String(tag))}
          type="dropdown"
        />
      ),
      filterIcon: (
        <Icon type="search" style={{ color: filter.tagIds.length > 0 ? '#1890ff' : undefined }} />
      ),
      render: (record: Question) =>
        record.tags.map((t) => (
          <Tag color="orange">{tags.find((tag) => tag.id === t.id)?.name}</Tag>
        ))
    },
    {
      title: '',
      key: 'actions',
      render: (record: Question) => (
        <>
          <Button
            type={picked.findIndex((p) => p.id === record.id) !== -1 ? 'danger' : 'primary'}
            onClick={() => handlePick(record)}
          >
            {picked.findIndex((p) => p.id === record.id) !== -1 ? <Icon type="cross" /> : 'Tilføj'}
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
            dataSource={pickedQuestions}
            expandedRowRender={(record) => <ExtendedRow record={record} />}
          />
        </div>
        <Divider hidden />
        {!user ? (
          <>
            <p style={{ color: 'grey' }}>
              Opret en gratis bruger oppe til højre. Dette lader dig også justere dine links på et
              senere tidspunkt
            </p>
            <Button disabled>Du skal være logget ind for at oprette links</Button>
          </>
        ) : (
          <Button
            loading={submitLoading}
            type="primary"
            disabled={picked.length < 1 || submitLoading}
            onClick={handleCreateLink}
          >
            Opret link
          </Button>
        )}
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
          options={semesters.map((semester) => ({
            value: semester.id,
            text: `${semester.value}. semester (${semester.name})`,
            key: semester.id
          }))}
          value={semesterId}
          onChange={(e, { value }: { value: number }) =>
            Selection.change({ type: 'semesterId', value })
          }
          fluid
          selection
        ></Dropdown>
        {shouldNotFetch && (
          <p style={{ textAlign: 'center', color: 'grey' }}>
            Angiv filtre (under forstørrelsesglassene herunder) for at søge efter spørgsmål
          </p>
        )}
        <Divider />
        <div style={{ overflowX: 'auto' }}>
          <Table
            rowKey={(record) => String(record.id)}
            dataSource={questions}
            loading={filterLoading || initialLoading}
            columns={columns}
            expandedRowRender={(record) => <ExtendedRow record={record} />}
          />
        </div>
      </Segment>
    </div>
  );
};

export default Sharebuilder;
