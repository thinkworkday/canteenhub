/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/display-name */
// ** React Imports
import {
  useEffect, useState, Fragment, forwardRef,
} from 'react';

// ** Third Party Components
import { Progress, Row, Col } from 'reactstrap';
import Stepper from 'bs-stepper';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';
import { ChevronRight } from 'react-feather';

// ** Styles
import 'bs-stepper/dist/css/bs-stepper.min.css';
import '../../@core/scss/base/plugins/forms/form-wizard.scss';

const Wizard = forwardRef((props, ref) => {
  // ** Props
  const {
    type, className, steps, separator, options, instance, currentOrder,
  } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  // ** Vars
  let stepper = null;

  // ** Step change listener on mount
  useEffect(() => {
    stepper = new Stepper(ref.current, options);
    ref.current.addEventListener('shown.bs-stepper', (event) => {
      setActiveIndex(event.detail.indexStep);
    });
    if (instance) { instance(stepper); }
    if (currentOrder) {
      stepper.to(currentOrder.currentStep);
    }
  }, [currentOrder]);

  // ** Renders Wizard Header
  const renderHeader = () => steps.map((step, index) => (
    <Fragment key={step.id}>
      {/* {index !== 0 && index !== steps.length ? <div className="line">{separator}</div> : null} */}
      <div
        className={classnames('step', {
          crossed: activeIndex > index,
          active: index === activeIndex,
        })}
        data-target={`#${step.id}`}
      >
        <button type="button" className="step-trigger">
          {/* <span className="bs-stepper-box">{step.icon ? step.icon : index + 1}</span> */}
          {/* <span className="bs-stepper-box">{step.icon ? step.icon : index + 1}</span> */}
          <span className="bs-stepper-label">
            <span className="bs-stepper-title">
              {index + 1}
              {'. '}
              <span className="title">{step.title}</span>
            </span>
            {/* {step.subtitle ? <span className="bs-stepper-subtitle">{step.subtitle}</span> : null} */}
          </span>
        </button>
      </div>

    </Fragment>
  ));

  // ** Renders Wizard Content
  const renderContent = () => steps.map((step, index) => (
    <div
      className={classnames('content', {
        'active dstepper-block': activeIndex === index,
      })}
      id={step.id}
      key={step.id}
    >
      {step.content}
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

        <Progress value="25" />
      </div>

      <div className="bs-stepper-content">{renderContent()}</div>
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
