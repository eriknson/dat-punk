import { web3, contract, sharedMessage } from '../../lib/web3';

const notOk = (res) => {
  res.status(403).json({ url: null })
}

const ok = (res) => {
  res.status(200).json({ url: "https://ipfs.io/ipfs/Qma399gy9xZg47shLuEtNmcfgyxh86e71dCMkQJ6gV418j/prism-download.zip" })
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

    contract.methods.hasAccess().call({ from: account })
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
