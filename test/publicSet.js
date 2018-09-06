const PublicSet = artifacts.require('PublicSet')
//const AddressVotes = artifacts.require('AddressVotes')
const PublicStakeBank = artifacts.require('PublicStakeBank')

const TokenRegistry = artifacts.require('TokenRegistry')
const BurnableERC20 = artifacts.require('BurnableERC20')

contract('PublicSet Unit Tests', accounts => {
  let set
  const validator = accounts[0]
  const test_system = accounts[9]
  const tokenId = 'Test'

  beforeEach(async () => {
    // Create sample Hytch co2kn
    hytchToken = await BurnableERC20.new(1000, { from: validator })

    // Create co2kn whitelist and add hytch token
    co2knlist = await TokenRegistry.new({ from: validator })
    await co2knlist.setToken(tokenId, hytchToken.address, { from: validator })

    //av = await AddressVotes.new()
    set = await PublicSet.new(co2knlist.address, 1, 1, test_system)
  })

  it('Should deposit validator', async () => {
    // Mint tokens and enable staking
    await hytchToken.mint(accounts[1], 1000, { from: validator })
    await hytchToken.approve(await set.getStakeBankAddr(), 1000, {
      from: accounts[1]
    })

    // Join public set and stake 100 tokens
    await set.deposit(100, tokenId, { from: accounts[1] })

    // Check that it joined the set
    let x = await set.isInValidatorSet(accounts[1])
    assert.equal(x, true)
  })

  it('Should deposit and withdraw validator', async () => {
    // Mint tokens and enable staking
    await hytchToken.mint(accounts[1], 1000, { from: validator })
    await hytchToken.approve(await set.getStakeBankAddr(), 1000, {
      from: accounts[1]
    })

    // Join public set and stake 100 tokens
    await set.deposit(100, tokenId, { from: accounts[1] })

    // Check that it joined the set
    let x = await set.isInValidatorSet(accounts[1])
    assert.equal(x, true)

    await set.withdraw(0, { from: accounts[1] })

    // Should no longer be in set
    let y = await set.isInValidatorSet(accounts[1])
    assert.equal(y, false)
  })

  it('Finalize should choose a subset of validators', async () => {
    //await set.finalizeChange(
  })
})
