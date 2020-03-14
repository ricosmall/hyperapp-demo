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
const triggerSearch = (state, keyCode) => {
  // When click `Enter` and state.query is not null, trigger search request
  if (keyCode !== 13 || !state.query) return state
  return fetchSearch(state)
}

const setNewValue = (state, value) => ({ ...state, query: value.trim() })

const fetchSearch = state => [
  { ...state, fetching: true },
  Http({
    url: `https://api.github.com/search/repositories?q=${state.query}&sort=stars`,
    response: 'json',
    action: getSearch
  })
]

const getSearch = (state, search) => ({ ...state, search, fetching: false })

const setScroll = (state, value) => {
  console.log(value)
  return state
}

/**
 * components
 */

const Link = ({ href, text }) => (
  <a
    className="box-border inline-block border px-4 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white border-blue-500 align-top"
    target="_blank"
    href={href}
  >
    {text}
  </a>
)
const GithubSearch = ({ search }) => (
  <div
    className="pt-6"
    onScroll={[
      setScroll,
      event => {
        console.log(event)
        return event.scrollTop
      }
    ]}
  >
    {search.items &&
      search.items.map(
        ({
          name,
          description,
          owner,
          html_url,
          homepage,
          stargazers_count,
          forks_count
        }) => (
          <div className="flex flex-col sm:flex-row px-4 mb-6 py-4 rounded shadow">
            <div className="md:flex-shrink-0">
              <img
                className="rounded box-border md:border block h-40 w-full object-cover object-center sm:w-24 sm:h-24"
                src={owner.avatar_url}
              />
            </div>
            <div className="sm:ml-4 mt-2 sm:mt-0 text-gray-600 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row justify-between text-sm">
                  <h3 className="text-xl leading-tight text-gray-900">
                    {name}
                  </h3>
                  <span className="inline-block">
                    <em className="text-purple-500">{stargazers_count}</em>stars{' '}
                    <em className="text-purple-500">{forks_count}</em>forks
                  </span>
                </div>
                <p className="text-sm leading-tight mt-1">{description}</p>
              </div>
              <p className="mt-2">
                <Link href={html_url} text="Github" />
                <span className="ml-2">
                  <Link href={owner.html_url} text="Owner" />
                </span>
                {homepage && (
                  <span className="ml-2">
                    <Link href={homepage} text="Home" />
                  </span>
                )}
              </p>
            </div>
          </div>
        )
      )}
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

const Search = () => (
  <div className="w-full lg:w-3/4 xl:w-1/2 px-4">
    <input
      className="search"
      placeholder="Press Enter to Search"
      onKeyup={[triggerSearch, event => event.keyCode]}
      onInput={[setNewValue, event => event.target.value]}
    />
  </div>
)

const view = state => (
  <div className="text-gray-900 font-light">
    <header className="header">
      <Search />
    </header>
    <main className="main  lg:w-3/4 xl:w-1/2">
      {state.fetching ? (
        <div className="pt-6 text-center">loading...</div>
      ) : (
        GithubSearch(state)
      )}
    </main>
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
