pragma solidity >=0.4.21 <0.6.0;

contract TodoList {
    uint public taskCount = 0;
    mapping(uint => Task) public tasks;

    struct Task {
        uint id;
        string content;
        bool completed;
        bool status;
    }

    event TaskCreated(
        uint id,
        string content,
        bool completed,
        bool status
    );

    event TaskCompleted(
        uint id,
        bool completed
    );

    event TaskDelete(
        uint id,
        bool status
    );

    constructor() public {}

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false, true);
        emit TaskCreated(taskCount, _content, false, true);
    }

    function deleteTask(uint _id) public {
      Task memory _task = tasks[_id];
      _task.status = false;
      tasks[_id] = _task;
      emit TaskDelete(_id, _task.status);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }
}