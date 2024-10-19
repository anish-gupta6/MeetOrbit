import React from 'react'
import './PlansPricing.css'
import {PiSealCheckFill} from 'react-icons/pi'
import { GiCheckMark } from "react-icons/gi";
import {ReactComponent as StarSVG} from '../../assets/star-ai-svg.svg'
import MidNavbar from '../midNav/MidNavbar';
const PlansPricing = () => {

  return (
    <div>
        <div className="midnavbar-cntnr">
            <MidNavbar/>
        </div>
      <div className="plans-pricing-main-container">
        <div className="plans-pricing-header-cntnr">Our Plans & Pricing</div>
        <div className="plans-pricing-main-desc-cntnr">Ideal for individuals seeking seamless access to our core features. Whether you're attending virtual meetings, engaging with our community, or collaborating with others, the <strong style={{color:'#0e72ed'}}>Plans</strong> provides all the essential tools you need to stay connected and productive. Enjoy high-quality video and audio, secure chat functionalities, and access to our intuitive platform - all with no compromises.</div>
        <div className="plans-pricing-duration-btn"></div>

        <div className="plans-pricing-cards-main-wrapper">

            <div className="plan-pricing-card-cntnr">
                <div className="plan-pricing-card-banner-content-cntnr">
                    <div className="card-banner-content-title">Basic</div>
                    <div className="card-banner-content-Price">
                        <div className="card-price">Free<sup className='card-price-points'></sup></div>
                    </div>
                    <div className="price-duration">Unlimited</div>
                </div>

                <div className="plan-pricing-feature-items-cntnr">
                    <div className="plan-pricing-feature-header"></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>25 minutes <div className="plan-pricing-item-desc">per meeting</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>50 Participants <div className="plan-pricing-item-desc">per meeting</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Team Chat </div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Notes <div className="plan-pricing-item-desc">up to 5 notes</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Recording <div className="plan-pricing-item-desc">5 five-minute recordings</div></div>
                </div>

                <buttton className="buy-plan-btn active-plan"><GiCheckMark /> Active Plan</buttton>
            </div>




            <div className="plan-pricing-card-cntnr">
                <div className="plan-pricing-card-banner-content-cntnr">
                    <div className="card-banner-content-title">Standard</div>
                    <div className="card-banner-content-Price">
                        <div className="card-price">&#8377;99<sup className='card-price-points'>49</sup></div>
                    </div>
                    <div className="price-duration">per month</div>
                </div>

                <div className="plan-pricing-feature-items-cntnr">
                    <div className="plan-pricing-feature-header">Everything in Basic, and:</div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>10 hours <div className="plan-pricing-item-desc">per meeting</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>150 Participants <div className="plan-pricing-item-desc">per meeting</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Notes <div className="plan-pricing-item-desc">up to 50 notes</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Recording <div className="plan-pricing-item-desc">50 two-hours recordings</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Whiteboard <div className="plan-pricing-item-desc">20 minutes per meeting</div></div>
                </div>

                <buttton className="buy-plan-btn inactive-plan">Upgrade Plan</buttton>
            </div>




            <div className="plan-pricing-card-cntnr">
                <div className="plan-pricing-card-banner-content-cntnr">
                    <div className="card-banner-content-title">Premium</div>
                    <div className="card-banner-content-Price">
                        <div className="card-price">&#8377;169<sup className='card-price-points'>99</sup></div>
                    </div>
                    <div className="price-duration">per month</div>
                </div>

                <div className="plan-pricing-feature-items-cntnr">
                <div className="plan-pricing-feature-header">Everything in Standard, and:</div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Unlimited Hours</div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>500 Participants <div className="plan-pricing-item-desc">per meeting</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Notes <div className="plan-pricing-item-desc">unlimited</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Recording <div className="plan-pricing-item-desc">unlimited</div></div>
                    <div className="plan-pricing-feature-items"><div className="plan-pricing-feature-item-icon"><PiSealCheckFill /></div>Whiteboard <div className="plan-pricing-item-desc">unlimited</div></div>
                </div>

                <buttton className="buy-plan-btn inactive-plan">Upgrade Plan</buttton>
            </div>


            
        </div>
      </div>
    </div>
  )
}

export default PlansPricing
