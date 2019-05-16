import React, { Component } from 'react'
// import { FEED_QUERY } from './LinkList'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

export const FEED_QUERY = gql`
 query {
    feed {
      links {
        id
        createdAt
        url
        description
    
        
        
      }
    }
  }
`


const UPDATE_LINK = gql `

  mutation updateLink($id: ID!, $description: String){
    updateLink(id: $id, description: $description){
      id
      description
    }
  }
`

// const updateLink = data.feed.links.find(link => link.id === id)
class Update extends Component {


    state = {
        description: ''
      }
    
      render() {
        const { description } = this.state
        
        return (
         

            <Query query={FEED_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <div>Fetching</div>
            if (error) return <div>Error</div>

            const getId = data.feed.links.find(link => link.id === linkId)
  
        return (
            <div>
             {getId.map((link, index) => (
                  <Link
                    key={link.id}
                    link={id}
                    index={index}
                    
                  />
                ))}
         
      
          <div>
            <div className="flex flex-column mt3">
              <input
                className="mb2"
                value={description}
                onChange={e => this.setState({ description: e.target.value })}
                type="text"
                placeholder="A description for the link"
              />
            </div>
            <Mutation
      mutation={UPDATE_LINK}
      variables={{ id: this.getId , description }}
      onCompleted={() => this.props.history.push('/')}
      update={(store, { data: { post } }) => {
        const data = store.readQuery({ query: FEED_QUERY })
        data.feed.links.unshift(post)
        store.writeQuery({
          query: FEED_QUERY,
          data
        })
      }}
    >
      {postMutation => <button onClick={postMutation}>Submit</button>}
    </Mutation>
    <button><a href="/">Home</a></button>
          </div>
       
        </div> )
    }}
    
        
    </Query>
    
    )
      }
    }




export default Update