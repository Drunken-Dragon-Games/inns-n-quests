use aiken/hash.{Blake2b_224, Hash}
use aiken/interval.{Finite}
use aiken/list
use aiken/transaction.{ScriptContext, Transaction} as tx
use aiken/transaction.{ValidityRange}
use aiken/transaction/credential.{VerificationKey}

type VerificationKeyHash =
  Hash<Blake2b_224, VerificationKey>

fn must_be_signed_by(transaction: Transaction, vk: VerificationKeyHash) {
  list.has(transaction.extra_signatories, vk)
}

type POSIXTime =
  Int

fn must_be_before(range: ValidityRange, upper_bound: POSIXTime) {
  when range.lower_bound.bound_type is {
    Finite(now) ->
      now < upper_bound
    _ ->
      False
  }
}

validator(owner: VerificationKeyHash, lock_time: POSIXTime) {
  fn cip68_mint(_redeemer: Data, ctx: ScriptContext) -> Bool {
    when ctx.purpose is {
      tx.Mint(_) ->
        must_be_signed_by(ctx.transaction, owner) && must_be_before(
          ctx.transaction.validity_range,
          lock_time,
        )
      _ ->
        False
    }
  }

  fn cip68_spend(_datum: Data, _redeemer: Data, _ctx: ScriptContext) -> Bool {
    False
  }
}
