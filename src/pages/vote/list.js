import { connect } from 'umi';
import Loading from 'components/loading';
import styles from './index.less';
import _ from 'i18n';

function List(props) {
  const { voteInfoArr, dispatch, currentVoteIndex, loading } = props;

  const detail = (index) => {
    dispatch({
      type: 'stake/save',
      payload: {
        currentVoteIndex: index,
      },
    });
  };

  const status = (info) => {
    const { unstarted, finished } = info;
    if (unstarted) {
      //投票未开始
      return _('pending');
    }

    if (!finished) {
      //投票未结束
      return <span className={styles.purple}>{_('ongoing')}</span>;
    }

    return '';
  };

  if (voteInfoArr.length < 1 && loading) {
    return (
      <div className={styles.left_content}>
        <Loading />
      </div>
    );
  }
  if (voteInfoArr.length < 1) {
    return <div className={styles.left_content}>No Data</div>;
  }

  return (
    <div className={styles.left_content}>
      <div className={styles.list}>
        {voteInfoArr.map((item, index, arr) => {
          const currentVoteInfo = item;
          const { title, beginBlockNum, endBlockNum, id } = currentVoteInfo;
          return (
            <div
              className={
                index === currentVoteIndex
                  ? `${styles.item} ${styles.item_selected}`
                  : styles.item
              }
              key={id}
              onClick={() => detail(index)}
            >
              <div className={styles.line}>
                <div className={styles.title}>{title}</div>
                <div className={styles.status}>{status(currentVoteInfo)}</div>
              </div>
              <div className={styles.desc}>
                {arr.length - index} from block #{beginBlockNum} to block #
                {endBlockNum}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const mapStateToProps = ({ stake, user, loading }) => {
  const { effects } = loading;
  return {
    ...stake,
    ...user,
    loading: effects['stake/getVoteInfo'],
  };
};

export default connect(mapStateToProps)(List);
