/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/display-name */
// ** React Imports
import {
  useEffect, useState, Fragment, forwardRef,
} from 'react';

// ** Third Party Components
import { Progress } from 'reactstrap';
import Stepper from 'bs-stepper';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';
import { ChevronRight } from 'react-feather';

// ** Styles
import 'bs-stepper/dist/css/bs-stepper.min.css';
import '@src/@core/scss/base/plugins/forms/form-wizard.scss';

const Wizard = forwardRef((props, ref) => {
  // ** Props
  const {
    type, className, steps, separator, options, instance, currentOrder, isLoading,
    setIsNewOrder,
  } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(2);
  // const [isLoading, setIsLoading] = useState(true);

  // ** Vars
  let stepper = null;

  // ** Step start listener on mount
  // useEffect(() => {
  //   stepper = new Stepper(ref.current, options);

  //   // ref.current.addEventListener('shown.bs-stepper', (event) => {
  //   //   setActiveIndex(event.detail.indexStep);
  //   //   console.log('ACTIVE INDEX:', event.detail.indexStep);
  //   // });

  //   // if (instance) { instance(stepper); }
  //   if (currentOrder) {
  //     stepper.to(currentOrder.currentStep);
  //   }

  //   // console.log('current step:', instance);
  // }, [currentOrder]);

  // if (currentOrder) {
  //   console.log(currentOrder);
  // }

  // ** Step change listener on mount
  useEffect(() => {
    stepper = new Stepper(ref.current, options);

    // Change Progress Bar
    ref.current.addEventListener('shown.bs-stepper', (event) => {
      setActiveIndex(event.detail.indexStep);
      if (event.detail.from === 2 && event.detail.to === 0) setIsNewOrder(true);
      else setIsNewOrder(false);
      // ** update Progress bar
      const stepperHeaderElement = document.querySelector('.bs-stepper-header') !== null;
      if (stepperHeaderElement) {
        const stepperWidth = document.querySelector('.bs-stepper-header').offsetWidth;
        const stepIndex = event.detail.indexStep;
        const stepElement = document.querySelectorAll('.bs-stepper-header .step')[stepIndex].offsetLeft + 30;
        const progressWidth = (stepElement / stepperWidth) * 100;
        setProgress(progressWidth);
      }
    });

    // Move to current step (if Cart Order in DB)

    if (currentOrder) {
      stepper.to(currentOrder.currentStep);
    }

    if (instance) { instance(stepper); }
  }, [currentOrder]);

  // ** Renders Wizard Header
  const renderHeader = () => steps.map((stepHeader, index) => (
    <Fragment key={stepHeader.id}>
      <div
        className={classnames('step', {
          crossed: activeIndex > index,
          active: index === activeIndex,
        })}
        data-target={`#${stepHeader.id}`}
      >
        <button type="button" className="step-trigger">
          <span className="bs-stepper-label">
            <span className="bs-stepper-title">
              {index + 1}
              {'. '}
              <span className="title">{stepHeader.title}</span>
            </span>
          </span>
        </button>
      </div>
    </Fragment>
  ));

  // ** Renders Wizard Content
  const renderContent = () => steps.map((step, index) => (
    <div
      className={classnames('content', `step-${index + 1}`, {
        'active dstepper-block': activeIndex === index,
      })}
      id={step.id}
      key={step.id}
    >
      {isLoading ? '' : step.content }
      {/* {step.content } */}
      {/* {index === 0 || index === 1 ? step.content : '' }
      {currentOrder && index === 2 ? step.content : '' }
      {currentOrder && index === 2 ? step.content : '' }
      {currentOrder && currentOrder.customer && currentOrder.customer._id && index === 3 ? step.content : '' } */}
    </div>
  ));

  return (
    <div
      ref={ref}
      className={classnames('bs-stepper', {
        [className]: className,
        vertical: type === 'vertical',
        'vertical wizard-modern': type === 'modern-vertical',
        'wizard-modern': type === 'modern-horizontal',
      })}
    >
      <div className="bs-stepper-header">
        {renderHeader()}
        <Progress value={progress} />
      </div>

      {/* <div className={`bs-stepper-content step-${activeIndex + 1}`}>{renderContent()}</div> */}
      <div className="bs-stepper-content">
        {renderContent()}
      </div>
    </div>
  );
});

export default Wizard;

// ** Default Props
Wizard.defaultProps = {
  type: 'horizontal',
  separator: <ChevronRight size={17} />,
  options: {},
};

// ** PropTypes
Wizard.propTypes = {
  type: PropTypes.string,
  instance: PropTypes.func,
  options: PropTypes.object,
  className: PropTypes.string,
  separator: PropTypes.element,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      icon: PropTypes.any,
      content: PropTypes.any.isRequired,
    })
  ).isRequired,
};
