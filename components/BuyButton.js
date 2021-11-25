const BuyButton = function ({ accounts, connect, buy, canBuy, hasAccess, download }) {
  let button = (<button onClick={connect}>Connect wallet to buy</button>)

  if (accounts.length > 0) {
    if (hasAccess) {
      button = (<button onClick={download}>Download</button>)
    } else if (canBuy) {
      button = (<button onClick={buy}>Buy for 0.01 ETH</button>)
    } else {
      button = (<button disabled>Sold out</button>)
    }
  }

  return (
    <footer>{button}</footer>
  )
}

export default BuyButton