import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsStarFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {ThreeDots} from 'react-loader-spinner'
import Header from '../Header'
import withRouter from '../AccessParams'
import './index.css'

const jobLoading = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {jobInfo: [], jobStatus: jobLoading.initial}

  componentDidMount() {
    this.jobData()
  }

  jobData = async () => {
    this.setState({jobStatus: jobLoading.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {id} = this.props.params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          skills: data.job_details.skills.map(each => ({
            name: each.name,
            imageUrl: each.image_url,
          })),
          title: data.job_details.title,
        },
        similarJobs: data.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
        })),
      }
      this.setState({jobInfo: updatedData, jobStatus: jobLoading.success})
    } else {
      this.setState({jobStatus: jobLoading.failure})
    }
  }

  jobSuccessView = () => {
    const {jobInfo} = this.state
    const {jobDetails, similarJobs} = jobInfo
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      location,
      packagePerAnnum,
      employmentType,
      jobDescription,
      lifeAtCompany,
      rating,
      skills,
      title,
    } = jobDetails

    return (
      <>
        <div className="individual-job-list-card">
          <div className="job-header-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-logo"
            />
            <div className="title-container">
              <h1 className="title-card">{title}</h1>
              <div className="job-rating-star">
                <BsStarFill className="star-image" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-package-card">
            <div className="location-type-card">
              <MdLocationOn className="icon-image" />
              <p className="location-type">{location}</p>
              <MdWork className="icon-image" />
              <p className="location-type">{employmentType}</p>
            </div>
            <p className="package-annum">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description-link-card">
            <h1 className="description-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              rel="noreferrer"
              target="_blank"
              className="ref-image"
            >
              <p>
                Visit <BiLinkExternal />
              </p>
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-container">
            {skills.map(each => (
              <li key={each.name} className="skills-card">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skills-image"
                />
                <p className="skills-heading">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-heading">Life at Company</h1>
          <div className="life-container">
            <p className="life-description">{lifeAtCompany.description}</p>
            <img
              className="life-image"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <div className="similar-job-container">
          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="similar-job-list">
            {similarJobs.map(similarJob => (
              <li key={similarJob.id} className="similar-job-list-card">
                <div>
                  <div className="job-header-container">
                    <img
                      src={similarJob.companyLogoUrl}
                      alt="similar job company logo"
                      className="job-logo"
                    />
                    <div className="title-container">
                      <h1 className="similar-title-card">{similarJob.title}</h1>
                      <div className="job-rating-star">
                        <BsStarFill className="star-image" />
                        <p className="star-num">{similarJob.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="job-describe-heading">Description</h1>
                    <p className="job-description">
                      {similarJob.jobDescription}
                    </p>
                  </div>
                </div>

                <div className="job-location-type">
                  <MdLocationOn className="icon-image" />
                  <p className="location-type">{similarJob.location}</p>
                  <MdWork className="icon-image" />
                  <p className="location-type">{similarJob.employmentType}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  jobFailureView = () => (
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
      <button className="retry-button" onClick={this.jobData} type="button">
        Retry
      </button>
    </div>
  )

  loadingView = () => (
    <div data-testid="loader" 
    className="loader-profile">
      <ThreeDots
        color="#ffffff"
        height="50px"
        width="50px"
      />
    </div>
  )

  jobResult = () => {
    const {jobStatus} = this.state
    switch (jobStatus) {
      case jobLoading.inprogress:
        return this.loadingView()
      case jobLoading.failure:
        return this.jobFailureView()
      case jobLoading.success:
        return this.jobSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-portal-container">{this.jobResult()}</div>
      </div>
    )
  }
}

export default withRouter(JobItemDetails)
