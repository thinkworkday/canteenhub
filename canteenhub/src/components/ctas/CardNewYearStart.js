import {
  Card, CardBody, CardText, Button,
} from 'reactstrap';
import iconStart from '@src/assets/images/icons/start.svg';

const CardNewYearStart = ({ newYearStartHandle }) => (
  <div>
    <Card className="card-approve-cta">
      <CardBody className="d-flex justify-content-lg-between align-items-center flex-wrap">
        <div className="d-flex">
          <div className="card-icon" style={{ height: 'fit-content' }}>
            <img className="" src={iconStart} alt="Start New Year" />
          </div>
          <div>
            <h6 className="mb-0">
              New year School
            </h6>
            <CardText>
              <small>
                If the new year school had already started, please Click Start button.
              </small>
            </CardText>
          </div>
        </div>
        <Button color="primary" className="waves-effect ml-auto btn btn-primary" onClick={() => newYearStartHandle(true)}>Start</Button>
      </CardBody>
    </Card>
  </div>
);

export default CardNewYearStart;
