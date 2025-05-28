import React from 'react';

export default function DashboardContent() {
    return (
        <div className="content-body container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-lg-8 mb-4 order-0">
                    <div className="card">
                        <div className="d-flex align-items-end row">
                            <div className="col-sm-7">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">Congratulations John! 🎉</h5>
                                    <p className="mb-4">
                                        You have done 72% more sales today. Check your new badge in your profile.
                                    </p>
                                    <a href="/profile" className="btn btn-sm btn-outline-primary">View Badges</a>
                                </div>
                            </div>
                            <div className="col-sm-5 text-center text-sm-left">
                                <div className="card-body pb-0 px-0 px-md-4">
                                    <img src="/assetsAdmin/img/illustrations/man-with-laptop-light.png" height="140" alt="Chart" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 order-1">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src="/assetsAdmin/img/icons/unicons/chart-success.png" alt="Chart" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn p-0" type="button" id="cardOpt3" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                                <a className="dropdown-item" href="#">View More</a>
                                                <a className="dropdown-item" href="#">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Profit</span>
                                    <h3 className="card-title mb-2">$12,628</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src="/assetsAdmin/img/icons/unicons/wallet-info.png" alt="Wallet" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn p-0" type="button" id="cardOpt6" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt6">
                                                <a className="dropdown-item" href="#">View More</a>
                                                <a className="dropdown-item" href="#">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Sales</span>
                                    <h3 className="card-title mb-2">$4,679</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.42%</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
                    <div className="card">
                        <div className="row row-bordered g-0">
                            <div className="col-md-8">
                                <h5 className="card-header m-0 me-2 pb-3">Total Revenue</h5>
                                <div id="totalRevenueChart" className="px-2">
                                    <canvas id="revenueChartCanvas" height="200"></canvas>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card-body">
                                    <div className="text-center">
                                        <div className="dropdown">
                                            <button className="btn btn-sm btn-outline-primary dropdown-toggle" type="button" id="growthReportId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                2022
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="growthReportId">
                                                <a className="dropdown-item" href="#">2021</a>
                                                <a className="dropdown-item" href="#">2020</a>
                                                <a className="dropdown-item" href="#">2019</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center fw-semibold pt-3 mb-2">62% Company Growth</div>
                                <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-3 flex-row align-items-center">
                                    <div className="avatar flex-shrink-0">
                                        <img src="/assetsAdmin/img/icons/unicons/cc-primary.png" alt="Credit Card" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">2022</small>
                                            <h6 className="fw-normal mb-0">$32.5k</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-3 flex-row align-items-center">
                                    <div className="avatar flex-shrink-0">
                                        <img src="/assetsAdmin/img/icons/unicons/wallet.png" alt="Wallet" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">2021</small>
                                            <h6 className="fw-normal mb-0">$41.2k</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
                    <div className="row">
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src="/assetsAdmin/img/icons/unicons/paypal.png" alt="Paypal" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn p-0" type="button" id="cardOpt4" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                                                <a className="dropdown-item" href="#">View More</a>
                                                <a className="dropdown-item" href="#">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="d-block mb-1">Payments</span>
                                    <h3 className="card-title text-nowrap mb-2">$2,456</h3>
                                    <small className="text-danger fw-semibold"><i className="bx bx-down-arrow-alt"></i> -14.82%</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src="/assetsAdmin/img/icons/unicons/cc-primary.png" alt="Credit Card" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn p-0" type="button" id="cardOpt1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt1">
                                                <a className="dropdown-item" href="#">View More</a>
                                                <a className="dropdown-item" href="#">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Transactions</span>
                                    <h3 className="card-title mb-2">$14,857</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.14%</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between flex-sm-row flex-column gap-3">
                                        <div className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                                            <div className="card-title">
                                                <h5 className="text-nowrap mb-2">Profile Report</h5>
                                                <span className="badge bg-label-warning rounded-pill">Year 2021</span>
                                            </div>
                                            <div className="mt-sm-auto">
                                                <small className="text-success text-nowrap fw-semibold">
                                                    <i className="bx bx-chevron-up"></i> 68.2%
                                                </small>
                                                <h3 className="mb-0">$84,686k</h3>
                                            </div>
                                        </div>
                                        <div id="profileReportChart"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between pb-0">
                            <div className="card-title mb-0">
                                <h5 className="m-0 me-2">Order Statistics</h5>
                                <small className="text-muted">42.82k Total Sales</small>
                            </div>
                            <div className="dropdown">
                                <button className="btn p-0" type="button" id="orderStatistics" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="orderStatistics">
                                    <a className="dropdown-item" href="#">Select All</a>
                                    <a className="dropdown-item" href="#">Refresh</a>
                                    <a className="dropdown-item" href="#">Share</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex flex-column align-items-center gap-1">
                                    <h2 className="mb-2">8,258</h2>
                                    <span>Total Orders</span>
                                </div>
                                <div id="orderStatisticsChart"></div>
                            </div>
                            <ul className="p-0 m-0">
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/paypal.png" alt="Paypal" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Electronic</h6>
                                            <small className="text-muted">Mobile, Earbuds, TV</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-semibold">82.5k</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/cc-primary.png" alt="Credit Card" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Fashion</h6>
                                            <small className="text-muted">T-shirt, Jeans, Shoes</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-semibold">23.8k</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/wallet.png" alt="Wallet" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Decor</h6>
                                            <small className="text-muted">Fine Art, Dining</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-semibold">849k</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/cc-warning.png" alt="Warning" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Sports</h6>
                                            <small className="text-muted">Football, Cricket Kit</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-semibold">99</small>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4 order-1 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <ul className="nav nav-pills" role="tablist">
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link active"
                                        role="tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#navs-tabs-line-card-income"
                                        aria-controls="navs-tabs-line-card-income"
                                        aria-selected="true"
                                    >
                                        Income
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link"
                                        role="tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#navs-tabs-line-card-expenses"
                                        aria-controls="navs-tabs-line-card-expenses"
                                        aria-selected="false"
                                    >
                                        Expenses
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link"
                                        role="tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#navs-tabs-line-card-profit"
                                        aria-controls="navs-tabs-line-card-profit"
                                        aria-selected="false"
                                    >
                                        Profit
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content p-0">
                                <div className="tab-pane fade show active" id="navs-tabs-line-card-income" role="tabpanel">
                                    <div className="d-flex mb-3">
                                        <div className="d-flex flex-column w-100">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span>Total Balance</span>
                                                <h4 className="mb-0">$459.10</h4>
                                            </div>
                                            <small className="text-success"><i className="bx bx-chevron-up"></i> 42.9%</small>
                                        </div>
                                        <div id="incomeChart"></div>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src="/assetsAdmin/img/icons/unicons/chart.png" alt="Chart" className="rounded" />
                                        </div>
                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <h6 className="mb-0">Expenses This Week</h6>
                                                <small className="text-muted">$39 less than last week</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4 order-2 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <div className="card-title mb-0">
                                <h5 className="m-0 me-2">Transactions</h5>
                                <small className="text-muted">Last 28 Days</small>
                            </div>
                            <div className="dropdown">
                                <button className="btn p-0" type="button" id="transactionID" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                                    <a className="dropdown-item" href="#">Last 28 Days</a>
                                    <a className="dropdown-item" href="#">Last Month</a>
                                    <a className="dropdown-item" href="#">Last Year</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <ul className="p-0 m-0">
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/paypal.png" alt="Paypal" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Paypal</small>
                                            <h6 className="mb-0">Send money</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">+82.6</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/wallet.png" alt="Wallet" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Wallet</small>
                                            <h6 className="mb-0">Mac'D</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">+270.69</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/chart.png" alt="Chart" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Transfer</small>
                                            <h6 className="mb-0">Refund</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">+637.91</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/cc-success.png" alt="Credit Card" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Credit Card</small>
                                            <h6 className="mb-0">Ordered Food</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">-838.71</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/wallet.png" alt="Wallet" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Wallet</small>
                                            <h6 className="mb-0">Starbucks</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">+203.33</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/assetsAdmin/img/icons/unicons/cc-warning.png" alt="Mastercard" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Mastercard</small>
                                            <h6 className="mb-0">Ordered Food</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">-92.45</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-backdrop fade"></div>
        </div>
    );
}