import React from 'react'
import { Formik, Field } from 'formik'
import PropTypes from 'prop-types'
import I18n from 'i18n-js'

import Modal from 'components/ui/Modal'
import Button from 'components/ui/Button'
import { SINGLE_CHART, MULTI_CHART } from 'redux/userPreferences/chartMode'
import { METRIC, IMPERIAL } from 'redux/userPreferences/unitSystem'
import Select from './Select'
import { FormBody, FormGroup, Label, Footer } from './elements'

const SettingsModal = ({ onSubmit, formValues, isShown, onHide: handleHide }) => {
  const chartModeOptions = [
    {
      value: MULTI_CHART,
      label: I18n.t('tracks.show.menu_sep')
    },
    {
      value: SINGLE_CHART,
      label: I18n.t('tracks.show.menu_one')
    }
  ]

  const unitSystemOptions = [
    {
      value: METRIC,
      label: I18n.t('tracks.show.m_units_metric')
    },
    {
      value: IMPERIAL,
      label: I18n.t('tracks.show.m_units_imperial')
    }
  ]

  return (
    <Modal isShown={isShown} onHide={handleHide} title="View preferences">
      <Formik initialValues={formValues} onSubmit={onSubmit}>
        {({ values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <FormBody>
              <FormGroup>
                <Label htmlFor="chartMode">{I18n.t('tracks.show.menu_header')}</Label>
                <Field
                  as={Select}
                  name="chartMode"
                  id="chartMode"
                  value={values.chartMode}
                  options={chartModeOptions}
                  onChange={({ value }) => setFieldValue('chartMode', value)}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="unitSystem">Units system</Label>
                <Field
                  as={Select}
                  name="unitSystem"
                  id="unitSystem"
                  value={values.unitSystem}
                  options={unitSystemOptions}
                  onChange={({ value }) => setFieldValue('unitSystem', value)}
                />
              </FormGroup>
            </FormBody>
            <Footer>
              <Button type="submit">{I18n.t('general.save')}</Button>
              <Button type="button" onClick={handleHide}>
                {I18n.t('general.cancel')}
              </Button>
            </Footer>
          </form>
        )}
      </Formik>
    </Modal>
  )
}

SettingsModal.propTypes = {
  formValues: PropTypes.shape({
    chartMode: PropTypes.string.isRequired,
    unitSystem: PropTypes.string.isRequired
  }).isRequired,
  isShown: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default SettingsModal