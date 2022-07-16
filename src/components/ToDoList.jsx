import React from 'react';
import Web3 from 'web3';
import {CONTRACT_ABI, CONTRACT_ADDRESS} from '../config';

//创建一个组件
class ToDoList extends React.Component {
    //构造函数
    constructor(props) {
        super(props);
        //this是父组件（类）的一个实例，实例就类似于java里的一个类，创建了这个类型的一个对象，这个对象就是实例
        this.state = {
            tasks: [],
            taskCount: 0,
            todoListByContract: null,
            loading: true
        }
        this.addToDo = this.addToDo.bind(this);
        this.inputToDo = React.createRef()
    }

    componentDidMount() {
        this.loadBlockchainData().then(_ => {
        })
    }

    async loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider)

        try {
            await Web3.givenProvider.enable();
        } catch (error) {
            // User denied account access...
        }

        const accounts = await web3.eth.getAccounts()
        console.log('accounts', accounts)
        this.setState({account: accounts[0]})

        this.setState({
            todoListByContract: new web3.eth.Contract(
                CONTRACT_ABI,
                CONTRACT_ADDRESS
            )
        }, async () => {
            this.setState({taskCount: await this.state.todoListByContract.methods.taskCount().call()}, async () => {
                let _tasks = [];
                for (let i = 1; i <= this.state.taskCount; i++) {
                    _tasks.push(await this.state.todoListByContract.methods.tasks(i).call())
                }

                // console.log(_tasks)
                this.setState({tasks: _tasks})
                this.setState({loading: false})
            })
        })
    }

    addToDo = async (event) => {
        if (event.keyCode === 13) {
            this.setState({loading: true})
            await this.state.todoListByContract.methods.createTask(this.inputToDo.current.value)
                .send({from: this.state.account}).then(() => {
                    let tempList = this.state.tasks;

                    tempList.push({
                        content: this.inputToDo.current.value,
                        completed: false,
                        status: true
                    });

                    this.setState({
                        tasks: tempList,
                    });
                    this.setState({loading: false})
                    this.inputToDo.current.value = '';
                })
        }
    }

    checkboxChange = async (id) => {
        this.setState({loading: true})
        await this.state.todoListByContract.methods.toggleCompleted(id)
            .send({from: this.state.account}).then(() => {
                let tempList = this.state.tasks;
                tempList.forEach((item) => {
                    if (item['id'] === id) {
                        item.completed = !item.completed;
                    }
                })

                this.setState({
                    tasks: tempList,
                });
                this.setState({loading: false})
            })
    }

    removeToDo = async (id) => {
        this.setState({loading: true})
        await this.state.todoListByContract.methods.deleteTask(id)
            .send({from: this.state.account}).then(() => {
                let tempList = this.state.tasks;

                tempList.forEach((item) => {
                    if (item['id'] === id) {
                        item.status = false;
                    }
                })

                this.setState({
                    tasks: tempList,
                });
                this.setState({loading: false})
        })
    }

    //render渲染虚拟DOM
    render() {
        return (
            <div>
                {/*<div>当前账号： {this.state.account}</div>*/}
                <header>添加Todo: <input type="text" ref={this.inputToDo} onKeyUp={this.addToDo}/> 按回车确认添加</header>
                <h2>待办事项</h2>
                <hr/>

                <ul className="list">
                    {
                        this.state.tasks.map((value, index) => {
                            if (!value.completed && value.status) {
                                return (
                                    <li key={index}>
                                        {/* */}
                                        <input key={index} type="checkbox" checked={value.completed}
                                               onChange={this.checkboxChange.bind(this, value.id)}/> {value.content}
                                        <button onClick={this.removeToDo.bind(this, value.id)} className="btn">删除
                                        </button>
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
                        this.state.tasks.map((value, index) => {
                            if (value.completed && value.status) {
                                return (
                                    <li key={index}>
                                        <input key={index} type="checkbox" checked={value.completed}
                                               onChange={this.checkboxChange.bind(this, value.id)}/> {value.content}
                                        <button onClick={this.removeToDo.bind(this, value.id)} className="btn">删除
                                        </button>
                                    </li>
                                );
                            }
                        })
                    }
                </ul>
                <div className={`${this.state.loading ? '':'hide'} loading-wrap`}>
                    <div className="loading">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                </div>
            </div>
        );
    }

}

export default ToDoList;