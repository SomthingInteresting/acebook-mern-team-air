import Post from './Post'

describe("Post", () => {
  it('renders a post with a message', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world"}} />);
    cy.get('[data-cy="post"]').should('contain.text', "Hello, world")
  })

  it('posts message with fullname', () => {
    cy.mount(<Post post={{id: 1, firstname:'Jack', lastname: 'test', message: 'Hello,world'}} />);
    cy.get('[data-cy="post"]').should('contain.text', 'Jack test : Hello,world')
  })
})
