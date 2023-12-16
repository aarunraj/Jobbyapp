import {Component} from 'react'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsSearch, BsStarFill} from 'react-icons/bs'
import {MdLocationOn, MdWork} from 'react-icons/md'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jobsLoadingStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Jobs extends Component {
  state = {
    profile: null,
    search: '',
    jobs: '',
    jobsStatus: jobsLoadingStatus.initial,
    employmentType: '',
    minimumPackage: '',
  }

  componentDidMount() {
    this.profileData()
    this.jobsData()
  }

  profileData = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updateData = {
        name: data.profile_details.name,
        image: data.profile_details.profile_image_url,
        bio: data.profile_details.short_bio,
      }
      this.setState({profile: updateData})
    }
  }

  jobsData = async () => {
    this.setState({jobsStatus: jobsLoadingStatus.loading})
    const {search, employmentType, minimumPackage} = this.state
    const updateEmpType =
      employmentType.length === 0 ? employmentType : employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs?employment_type=${updateEmpType}&minimum_package=${minimumPackage}&search=${search}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updateData = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        location: job.location,
        rating: job.rating,
        packageAnnum: job.package_per_annum,
        description: job.job_description,
        type: job.employment_type,
        companyLogo: job.company_logo_url,
      }))

      this.setState({jobs: updateData, jobsStatus: jobsLoadingStatus.success})
    } else {
      this.setState({jobsStatus: jobsLoadingStatus.failure})
    }
  }

  profileView = () => {
    const {profile} = this.state
    if (profile !== null) {
      return (
        <div className="profile-container">
          <img className="profile-picture" src={profile.image} alt="profile" />
          <h1 className="profile-heading">{profile.name}</h1>
          <p className="profile-bio">{profile.bio}</p>
        </div>
      )
    }
    return (
      <div className="retry-button-card">
        <button
          onClick={this.profileData}
          className="retry-button"
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }

  loadingView = () => (
    <div data-testid="loader"
    className="loader-card"
    >
      <ThreeDots
        color="#ffffff"
        height="50px"
        width="50px"
      />
    </div>
  )

  jobsSuccessView = () => {
    const {jobs} = this.state
    if (jobs.length > 0) {
      return (
        <ul className="jobs-list-container">
          {jobs.map(job => (
            <li className="job-container" key={job.id}>
              <Link to={`/jobs/${job.id}`} className="link">
                <div className="job-header-container">
                  <img
                    src={job.companyLogo}
                    alt="company logo"
                    className="job-logo"
                  />
                  <div className="title-container">
                    <h1 className="title-card">{job.title}</h1>
                    <div className="job-rating-star">
                      <BsStarFill className="star-image" />
                      <p className="star-num">{job.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="job-detail">
                  <div className="job-location-type">
                    <MdLocationOn className="icon-image" />
                    <p className="job-location">{job.location}</p>
                    <MdWork className="icon-image" />
                    <p>{job.type}</p>
                  </div>
                  <p className="package-annum">{job.packageAnnum}</p>
                </div>

                <hr className="line" />

                <div>
                  <h1 className="job-describe-heading">Description</h1>
                  <p className="job-description">{job.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="failure-image"
        />
        <h1 className="failure-heading">No Jobs Found</h1>
        <p className="failure-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  jobsFailureView = () => (
    <>
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-description">
          We cannot seem to find the page you are looking for.
        </p>
        <button className="retry-button" onClick={this.jobsData} type="button">
          Retry
        </button>
      </div>
    </>
  )

  handleSearch = event => {
    this.setState({search: event.target.value})
  }

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      this.jobsData()
    }
  }

  handleCheckbox = event => {
    if (event.target.checked) {
      this.setState(
        prev => ({
          employmentType: [...prev.employmentType, event.target.value],
        }),
        this.jobsData,
      )
    } else {
      this.setState(
        prev => ({
          employmentType: prev.employmentType.filter(
            each => each !== event.target.value,
          ),
        }),
        this.jobsData,
      )
    }
  }

  handleRadio = event => {
    if (event.target.checked) {
      this.setState({minimumPackage: event.target.value}, this.jobsData)
    }
  }

  jobsStatusCheck = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case jobsLoadingStatus.loading:
        return this.loadingView()
      case jobsLoadingStatus.success:
        return this.jobsSuccessView()
      default:
        return this.jobsFailureView()
    }
  }

  render() {
    const {profile, search} = this.state

    return (
      <div>
        <Header />
        <nav className="jobs-bg-container">
          <div className="jobs-lg-left-container">
            <div className="jobs-sm-search-container">
              <input
                className="search"
                onChange={this.handleSearch}
                onKeyDown={this.handleKeyDown}
                type="search"
                value={search}
                placeholder="Search"
              />
              <button
                type="button"
                className="search-button"
                onClick={this.jobsData}
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div>
              {profile === null ? this.loadingView() : this.profileView()}
            </div>

            <hr className="line" />

            <div>
              <h1 className="employment-salary-heading">Type of Employment</h1>
              <ul className="employment-salary-card">
                {employmentTypesList.map(each => (
                  <li
                    className="employment-salary-items"
                    key={each.employmentTypeId}
                  >
                    <input
                      value={each.employmentTypeId}
                      id={each.employmentTypeId}
                      onChange={this.handleCheckbox}
                      type="checkbox"
                      className="employment-salary-input"
                    />
                    <label
                      htmlFor={each.employmentTypeId}
                      className="employment-salary-label"
                    >
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="line" />

            <div>
              <h1 className="employment-salary-heading">Salary Range</h1>
              <ul className="employment-salary-card">
                {salaryRangesList.map(each => (
                  <li
                    key={each.salaryRangeId}
                    className="employment-salary-items"
                  >
                    <input
                      value={each.salaryRangeId}
                      type="radio"
                      id={each.salaryRangeId}
                      name="radio"
                      onChange={this.handleRadio}
                      className="employment-salary-input"
                    />
                    <label
                      htmlFor={each.salaryRangeId}
                      className="employment-salary-label"
                    >
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-lg-right-container">
            <div className="jobs-lg-search-container">
              <input
                className="search"
                onChange={this.handleSearch}
                onKeyDown={this.handleKeyDown}
                type="search"
                value={search}
                placeholder="Search"
              />
              <button
                type="button"
                className="search-button"
                onClick={this.jobsData}
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div>{this.jobsStatusCheck()}</div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Jobs
