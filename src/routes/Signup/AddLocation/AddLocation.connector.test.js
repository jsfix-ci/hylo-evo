import { mapDispatchToProps, mapStateToProps } from './AddLocation.connector'

describe('AddLocation.connector', () => {
  it('should match latest snapshot for mapDispatchToProps', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
  it('should match latest snapshot for mapStateToProps', () => {
    expect(mapStateToProps).toMatchSnapshot()
  })
})
