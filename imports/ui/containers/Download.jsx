import React from 'react';
import { DownloadPage } from '../components/Download';
export class DownloadContainer extends React.Component {
    render() {
        return <DownloadPage {...this.props} />;
    }
}