import { TaskList } from '../tasks';

const MyTasks = ({ teamwide = false }) => {
  return (
    <TaskList teamwide={teamwide} />
  );
};

export default MyTasks; 