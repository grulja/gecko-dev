import pytest
from webdriver import NoSuchElementException

URL = "https://www.lamudi.co.id/loan-calculator/"
SELECT_CSS = "select[name='LoanCalculatorForm[period]']"
CAPTCHA_TEXT = "Please click on the screen or move mouse for authentication"


async def is_fastclick_active(client):
    async with client.ensure_fastclick_activates():
        await client.navigate(URL)
        try:
            client.click(client.await_text(CAPTCHA_TEXT))
        except NoSuchElementException:
            pass
        return client.test_for_fastclick(client.await_css(SELECT_CSS))


@pytest.mark.only_platforms("android")
@pytest.mark.asyncio
@pytest.mark.with_interventions
async def test_enabled(client):
    assert not await is_fastclick_active(client)


@pytest.mark.only_platforms("android")
@pytest.mark.asyncio
@pytest.mark.without_interventions
async def test_disabled(client):
    assert await is_fastclick_active(client)
