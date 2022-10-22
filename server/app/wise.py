import uuid

import requests

from server.app.shemas import Currency

base_url = "https://api.sandbox.transferwise.tech"


def get_bearer(token: str):
    return {"Authorization": f"Bearer {token}"}


def get_wise_user_profile(token: str):
    resp = requests.get(base_url + "/v2/profiles", headers=get_bearer(token))
    if resp.status_code != 200:
        raise Exception("Bad", resp.status_code, resp.json())
    return resp.json()[0]


def get_balance(token: str, user_profile=None):
    user_profile = (
        get_wise_user_profile(token) if user_profile is None else user_profile
    )
    resp = requests.get(
        base_url + f"/v4/profiles/{user_profile['id']}/balances?types=STANDARD",
        headers=get_bearer(token),
    )
    if resp.status_code != 200:
        raise Exception("Bad", resp.status_code, resp.json())
    return resp.json()[0]


def get_savings(token: str, balance_id: int | None):
    user_profile = get_wise_user_profile(token)
    resp = requests.get(
        base_url + f"/v4/profiles/{user_profile['id']}/balances?types=SAVINGS",
        headers=get_bearer(token),
    )
    if resp.status_code != 200:
        raise Exception("Bad", resp.status_code, resp.json())
    return [b for b in resp.json() if balance_id is None or b["id"] == balance_id]


def delete_balance(token: str, balance_id: int):
    user_profile = get_wise_user_profile(token)
    requests.delete(
        base_url + f"/v3/profiles/{user_profile['id']}/balances/{balance_id}",
        headers=get_bearer(token),
    )
    return None


def topup_balance(
    token: str,
    balance_id: int,
    amount: float,
    curr: Currency,
):
    user_profile = get_wise_user_profile(token)

    resp = requests.post(
        base_url + f"/v1/simulation/balance/topup",
        headers={
            **get_bearer(token),
        },
        json={
            "profileId": user_profile["id"],
            "balanceId": balance_id,
            "currency": curr.value,
            "amount": amount,
        },
    )
    if resp.status_code != 200:
        raise Exception("Bad", resp.status_code, resp.json())
    return resp.json()


def create_saving_account(token: str, account_name: str, currency: Currency):
    user_profile = get_wise_user_profile(token)
    resp = requests.post(
        base_url + f"/v4/profiles/{user_profile['id']}/balances",
        headers={
            **get_bearer(token),
            "X-idempotence-uuid": str(uuid.uuid4()),
        },
        json={
            "type": "SAVINGS",
            "currency": currency.value,
            "name": account_name,
        },
    )
    if resp.status_code != 201:
        raise Exception("Bad", resp.status_code, resp.json())
    return resp.json()["id"]
