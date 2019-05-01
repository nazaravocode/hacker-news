import React, {Component} from 'react';
import './App.css';
import Clock from './Clock';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = searchTerm =>
    item => {
        console.log(item);
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }


/*
function isSearched(searchTerm) {
    return function (item) {
        return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== 1;

    }
}
*/

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        };
        console.log('url', url);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    setSearchTopStories(result) {
        this.setState({result});
        console.log('setSearchTopStories ', this.state.result);
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        console.log('${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}', `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`);
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            //.then(response => response.json())
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    onDismiss(id) {
        let newList = this.state.list.filter(item => item.objectID !== id);
        this.setState({
            list: newList
        })
    }

    onSearchChange(event) {
        console.log(this);
        console.log(event.target.value);

        this.setState({
            searchTerm: event.target.value
        });
    }

    render() {
        const {searchTerm, result} = this.state;
        if (!result) {
            return null;
        }
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                    >
                        Поиск
                    </Search>
                </div>
                <Table
                    list={result.hits}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />
            </div>
        );
    }

}

const Search = ({value, onChange, children}) =>

    <form>
        <div className="form-group">
            <label htmlFor="usr"> {children}</label>
            <input type="text"
                   className="form-control"
                   id="usr"
                   value={value}
                   onChange={onChange}/>
        </div>
    </form>

// list.filter(isSearched(pattern)).map(item =>
const Table = ({list, pattern, onDismiss}) =>
    <div className="table">
        {list && list.filter(isSearched(pattern)).map(item =>
            <div key={item.objectID} className="table-row" style={{paddingTop: 20}}>
                <span style={{width: '40%'}}>
                     <a href={item.url}>{item.title}</a>
                </span>
                <span style={{width: '30%', paddingLeft: 20}}>
                            {item.author}
                    </span>
                <span style={{width: '10%', paddingLeft: 20}}>
                        {item.num_comments}
                    </span>
                <span style={{width: '10%', paddingLeft: 20}}>
                        {item.points}
                    </span>
                <span style={{width: '10%', paddingLeft: 20}}>
                        <Button
                            onClick={() => onDismiss(item.objectID)}
                            className="button-inline"
                        >
                            Отбросить
                        </Button>
                    </span>
            </div>
        )}
    </div>

class Button extends Component {
    render() {
        const {
            onClick,
            className = '',
            children
        } = this.props;

        return (
            <button
                onClick={onClick}
                className={className}
                type="button"
            >
                {children}
            </button>
        )

    }
}

export default App;
