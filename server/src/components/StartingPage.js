import React from 'react';

const StartingPage = () => {
	return (
		<div className="container" style={{ width: '100%' }}>
			<div className="topnav">
				<div className="applitrace_logo" style={{ marginBottom: '20px' }}>
					<a href="/">AppliTrace</a>
				</div>
				<div className="links_holder">
					<a href="/" className="link_active">
						Home
					</a>
					<a href="/users/login">Login</a>
					<div className="register_link">
						<a href="/users/register">REGISTER</a>
					</div>
				</div>
			</div>
			<div className="form_box">
				<div className="home">
					<h1>Your job search tracker.</h1>

					<div className="section">
						<div className="explainer">
							<h2>Keep your job search proccess organized.</h2>
							<p>
								Use AppliTrace to update the status of your application.
								<br />
								<br />Keep contact information for recruiters.
								<br />
								<br />Keep notes and position information for quick reference.
							</p>
						</div>
						<img
							className="small_screenshot"
							src="Screenshots/AppliTraceDashboardLightTheme.png"
							alt="Dashboard"
						/>
					</div>

					<h2>Track your applications digitally instead of using a complicated excel sheet or notebook.</h2>
					<div className="section">
						<img
							className="large_screenshot"
							src="Screenshots/AppliTraceAddJobManually.png"
							alt="Dashboard"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StartingPage;
