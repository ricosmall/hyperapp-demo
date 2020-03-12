import { h, app } from 'hyperapp'
import { Http } from 'hyperapp-fx'
import './index.css'

/**
 * initial state
 */
const init = {
  count: 1,
  query: 'jsonresume',
  search: {}
}

/**
 * actions
 */
// actions for Counter
const increment = state => ({ ...state, count: state.count + 1 })
const decrement = state => ({ ...state, count: state.count - 1 })

// actions for GithubSearch
const fetchSearch = state => [
  { ...state, fetching: true },
  Http({
    url: `https://api.github.com/search/repositories?q=${state.query}&sort=stars`,
    response: 'json',
    action: getSearch
  })
]
const getSearch = (state, search) => ({ ...state, search })

/**
 * components
 */
const GithubSearch = ({ search }) => (
  <div>
    <ul>
      {search.items && search.items.map(item => (
        <li>
          <img src={item.owner.avatar_url} />
          <h1>{item.name}</h1>
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  </div>
)

const Counter = ({ count }) => (
  <div className="mx-auto text-center">
    <h1 className="text-6xl">{count}</h1>
    <div className="inline-flex">
      <button className="btn hover:bg-gray-400 rounded-l" onClick={increment}>
        +
      </button>
      <button className="btn hover:bg-gray-400 rounded-r" onClick={decrement}>
        -
      </button>
    </div>
  </div>
)

const view = state => (
  <div className="">
    {Counter(state)}
    {GithubSearch(state)}
  </div>
)

/**
 * element to mount app
 */
const node = document.getElementById('app')

/**
 * create app
 */
app({ node, view, init: fetchSearch(init) })
