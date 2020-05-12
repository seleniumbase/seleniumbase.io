[<img src="https://cdn2.hubspot.net/hubfs/100006/images/super_logo_sb.png" title="SeleniumBase" height="48">](../README.md)

[<img src="http://img.youtube.com/vi/Sjzq9kU5kOw/0.jpg" title="SeleniumBase" height="200">](https://www.youtube.com/watch?v=Sjzq9kU5kOw)

(**[Watch an overview on YouTube](https://www.youtube.com/watch?v=Sjzq9kU5kOw)**)

<a id="feature_list"></a>
## Features
* A complete test automation framework for web/mobile UI testing.
* Uses [pytest](https://docs.pytest.org/en/latest/), [unittest](https://docs.python.org/3/library/unittest.html), and [nose](http://nose.readthedocs.io/en/latest/) for test discovery and execution.
* No more flaky tests! (Smart-waiting code keeps tests reliable.)
* Includes powerful [console scripts](../seleniumbase/console_scripts/ReadMe.md). Type **``seleniumbase``** to activate.
* Has the ability to translate tests into [multiple spoken languages](https://github.com/seleniumbase/SeleniumBase/tree/master/examples/translations).
* Has a flexible [command-line interface](customizing_test_runs.md) for customizing test runs.
* Can run tests multithreaded in parallel. (Use ``-n NUM_THREADS``)
* Has [Plugins](https://github.com/seleniumbase/SeleniumBase/tree/master/seleniumbase/plugins) for logging data and screenshots. ([Click to learn more](../examples/example_logs/ReadMe.md))
* Has a [global config file](https://github.com/seleniumbase/SeleniumBase/blob/master/seleniumbase/config/settings.py) for configuring SeleniumBase as needed.
* Includes a [website tour builder](../examples/tour_examples/ReadMe.md) for creating interactive walkthroughs.
* Backwards-compatible with [WebDriver](https://www.selenium.dev/projects/). (Use ``self.driver`` anywhere.)
* Includes code to [export Katalon Recorder scripts into SeleniumBase format](../integrations/katalon/ReadMe.md).
* Can run tests in Headless Mode to hide the web browser. (Use ``--headless``)
* Can run tests through a proxy server. (Use ``--proxy=IP_ADDRESS:PORT``)
* Can use an authenticated proxy server. (``--proxy=USER:PASS@IP_ADDRESS:PORT``)
* Can change the web browser's user agent string. (Use ``--agent=USER_AGENT_STRING``)
* Can run tests using Chrome's mobile device emulator (Use ``--mobile``)
* Can set a Chrome User Data Directory / Profile to load. (Use ``--user_data_dir=DIR``)
* Can load Chrome Extension ZIP files. (Use ``--extension_zip=ZIP``)
* Can load Chrome Extension folders. (Use ``--extension_dir=DIR``)
* Can handle Google Authenticator logins with [Python's one-time password library](https://pyotp.readthedocs.io/en/latest/).
* Includes a hybrid-automation solution called [MasterQA](../seleniumbase/masterqa/ReadMe.md) to speed up manual testing.
* Integrates with [MySQL](https://github.com/seleniumbase/SeleniumBase/blob/master/seleniumbase/core/testcase_manager.py), [Selenium Grid](https://github.com/seleniumbase/SeleniumBase/tree/master/seleniumbase/utilities/selenium_grid), [Azure](../integrations/azure/jenkins/ReadMe.md), [Google Cloud](https://github.com/seleniumbase/SeleniumBase/tree/master/integrations/google_cloud/ReadMe.md), [AWS](https://github.com/seleniumbase/SeleniumBase/blob/master/seleniumbase/plugins/s3_logging_plugin.py), and [Docker](../integrations/docker/ReadMe.md).
* Can connect to [BrowserStack](https://www.browserstack.com/automate#), [Sauce Labs](https://saucelabs.com/products/web-testing/cross-browser-testing), or [TestingBot](https://testingbot.com/features) Selenium Grids.
* Includes a [tool to convert Selenium IDE recordings](https://github.com/seleniumbase/SeleniumBase/tree/master/seleniumbase/utilities/selenium_ide) into simple SeleniumBase scripts.
* Can load and make assertions on PDF files from websites or the local file system.
* Can reuse the same Selenium browser session between tests. (Use: ``--reuse-session``)
* Written in Python, but can also make JavaScript calls. (Use: ``self.execute_script()``)
* Includes useful [Python decorators and password obfuscation methods](../seleniumbase/common/ReadMe.md).

[<img src="https://cdn2.hubspot.net/hubfs/100006/images/super_logo_3.png" title="SeleniumBase" height="48">](../README.md)
