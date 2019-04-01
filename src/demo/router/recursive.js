import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

const persons = [
  {id:1, name:'kobe', friends: [2,3,4]},
  {id:2, name:'james', friends: [1,3]},
  {id:3, name:'antony', friends: [2,4]},
  {id:4, name:'paul', friends: [1,2,3]}
]

const find = (id) => {
  return persons.find(per => per.id == id)
}

const Person = ({match}) => {
  let person = find(match.params.id)
  return (
    <div>
      <h3> {person.name} ’s Friends </h3>
      <ul>
        {
          person.friends.map(id => 
            <li key={id}>
              <Link to={`${match.url}/${id}`}>{find(id).name}</Link>
            </li>
          )
        }
      </ul>
      <Route path={`${match.url}/:id`} component={Person} />
    </div>
  )
}

const RecursiveExample = () => {
  return (
    <Person match={{ params:{id:1}, url:"" }} />
  )
}
export default RecursiveExample

