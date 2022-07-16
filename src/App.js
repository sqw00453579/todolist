import logo from './logo.svg';
import './App.css';

function App() {
    const [account, setAccount] = useState(); // 设置账号的状态变量
    const [contract, setContract] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [taskCount, setTaskCount] = useState();
    const [inputToDo, setInputToDo] = useState('');
    const [shouldReload, reload] = useState(false)
    const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])

    useEffect(() => {
        async function load() {
            const web3 = new Web3(Web3.givenProvider);
            const accounts = await web3.eth.requestAccounts();
            setAccount(accounts[0]);

            setContract(new web3.eth.Contract(
                CONTRACT_ABI,
                CONTRACT_ADDRESS
            ));
            const taskCount = await contract.methods.taskCount().call();
            setTaskCount(taskCount);

            let _task = [];
            for (let i = 1; i <= taskCount; i++) {
                _task.push(await contract.methods.tasks(i).call())
                console.log(i)
            }

            setTasks(_task)
            console.log('tasks', tasks);
        }

        load().then(_ => {
        });
    }, []);

    async function addToDo(event) {
        setInputToDo(event.target.value)
        if (event.keyCode === 13) {
            let tempList = tasks;

            tempList.push({
                content: inputToDo,
                completed: false,
            });

            setTasks(tempList);
            setInputToDo('');
        }
    }

    async function checkboxChange(index) {
        tasks[index].completed = !tasks[index].completed;
        setTasks(tasks)
        reloadEffect()
    }

    return (
        <div>
            <div>当前账号： {account} , {taskCount}</div>
            <div>
                <header>添加Todo: <input type="text" onKeyUp={(e) => addToDo(e)}/> 按回车确认添加</header>
                <h2>待办事项</h2>
                <hr/>
                <ul className="list">
                    {
                        tasks.map((value, index) => {
                            if (!value.completed) {
                                return (
                                    <li key={index}>
                                        {/* */}
                                        <input key={index} type="checkbox" checked={value.completed}
                                               onChange={checkboxChange.bind(this, index)}/> {value.content}
                                        <button className="btn">删除</button>
                                    </li>
                                );
                            }
                        })
                    }
                </ul>
                <h2>已完成事项</h2>
                <hr/>
                <ul className="list">
                    {
                        tasks.map((value, index) => {
                            if (value.completed) {
                                return (
                                    <li key={index}>
                                        <input key={index} type="checkbox" checked={value.completed}
                                               onChange={checkboxChange.bind(this, index)}/> {value.content}
                                        <button className="btn">删除
                                        </button>
                                    </li>
                                );
                            }
                        })
                    }
                </ul>
            </div>
        </div>
    );
}

export default App;
