import { web3, contract, sharedMessage } from '../../lib/web3'

const notOk = (res) => {
  res.status(403).json({ url: 'null' })
}

const ok = (res) => {
  res.status(200).json({
    url: 'https://bafybeia7rsevkel4xfowaxb5muy4vkji4xk47covnda35exeogrl6uvkfu.ipfs.dweb.link/bullfest.mp3',
  })
}

export default async function handler(req, res) {
  // TODO: make sure the download is only
  // accessible to people who own it
  try {
    const body = JSON.parse(req.body)

    if (!body.signature) {
      notOk(res)
    }

    const account = web3.eth.accounts.recover(sharedMessage, body.signature)

    contract.methods
      .hasAccess()
      .call({ from: account })
      .then(function (data) {
        if (data) {
          ok(res)
        } else {
          notOk(res)
        }
      })
  } catch (e) {
    notOk(res)
  }
}
